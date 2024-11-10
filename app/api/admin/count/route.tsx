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
    
    // Add query to only count active/valid admin accounts
    const count = await AdminRegisterSchema.countDocuments(
      { isActive: true, isVerified: true },
      { 
        maxTimeMS: 30000,
        strict: true,
        lean: true
      }
    );

    // Validate count result
    if (typeof count !== 'number') {
      throw new Error("Invalid count returned from database");
    }
    
    // Return count with proper headers
    return NextResponse.json(
      { count },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );

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
