import { NextResponse } from "next/server";
import User from "../../../../models/registerSchema";
import connectDB from "../../../../lib/connectToDatabase";

export async function GET() {
  try {
    // Connect to database
    await connectDB();

    // Get all users, excluding passwords
    const users = await User.find().select("-password").maxTimeMS(30000);

    return new NextResponse(JSON.stringify(users), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
