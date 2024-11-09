import { NextResponse } from "next/server";
import User from "../../../../models/registerSchema";
import connectDB from "../../../../lib/connectToDatabase";

export async function GET() {
  try {
    // Connect to database
    await connectDB();

    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();

    // Get all users, excluding passwords
    const users = await User.find()
      .select("-password")
      .maxTimeMS(30000)
      .lean(); // Use lean() for better performance

    return new NextResponse(JSON.stringify(users), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '-1',
        'Surrogate-Control': 'no-store',
        'Last-Modified': new Date().toUTCString(),
        'ETag': `W/"${timestamp}"` // Add ETag for cache validation
      }
    });

  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
  }
}
