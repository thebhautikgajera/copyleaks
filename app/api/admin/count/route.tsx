import { NextResponse } from "next/server";
import connectDB from "../../../../lib/connectToDatabase";
import AdminRegisterSchema from "../../../../models/adminRegisterSchema";

export async function GET() {
  try {
    await connectDB();
    
    const count = await AdminRegisterSchema.countDocuments();
    
    return NextResponse.json({ count }, { status: 200 });

  } catch (error) {
    console.error("Failed to get admin count:", error);
    return NextResponse.json(
      { error: "Failed to get admin count" },
      { status: 500 }
    );
  }
}
