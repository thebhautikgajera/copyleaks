import { NextResponse } from "next/server";
import User from "../../../../models/registerSchema";
import connectDB from "../../../../lib/connectToDatabase";

export async function GET() {
  try {
    // Connect to database
    await connectDB();

    // Get all users, excluding passwords
    const users = await User.find().select("-password");

    return NextResponse.json(users, { status: 200 });

  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
