import { NextResponse } from "next/server";
import connectDB from "../../../../lib/connectToDatabase";
import AdminRegisterSchema from "../../../../models/adminRegisterSchema";

export async function GET() {
  try {
    await connectDB();
    
    const count = await AdminRegisterSchema.countDocuments({}, { maxTimeMS: 30000 });
    
    return new NextResponse(JSON.stringify({ count }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error("Failed to get admin count:", error);
    return NextResponse.json(
      { error: "Failed to get admin count" },
      { status: 500 }
    );
  }
}
