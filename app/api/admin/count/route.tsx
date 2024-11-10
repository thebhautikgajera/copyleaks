import { NextResponse } from "next/server";
import connectDB from "../../../../lib/connectToDatabase";
import AdminRegisterSchema from "../../../../models/adminRegisterSchema";

export async function GET() {
  try {
    // Ensure database connection
    await connectDB();

    // Add error handling for database connection
    if (!AdminRegisterSchema) {
      throw new Error('Database model not initialized');
    }
    
    // Use aggregate to count active/verified admins
    const result = await AdminRegisterSchema.aggregate([
      {
        $match: {
          isActive: true,
          isVerified: true
        }
      },
      {
        $count: "totalCount"
      }
    ]).exec();

    // Extract count from aggregate result
    const count = result[0]?.totalCount || 0;

    // Validate count result
    if (typeof count !== 'number') {
      throw new Error("Invalid count returned from database");
    }
    
    // Return count with proper headers
    return new NextResponse(JSON.stringify({ count }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error: unknown) {
    console.error("Failed to get admin count:", error);
    return NextResponse.json(
      { 
        error: "Failed to get admin count",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
