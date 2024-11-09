import { NextResponse } from "next/server";
import User from "../../../../models/registerSchema";
import connectDB from "../../../../lib/connectToDatabase";

export async function POST() {
  try {
    // Connect to database
    await connectDB();

    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();

    // Get all users, excluding passwords, with a shorter timeout
    const users = await User.find()
      .select("-password")
      .maxTimeMS(15000) // 15 second timeout
      .lean(); // Use lean() for better performance

    return new NextResponse(JSON.stringify(users), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
        'Last-Modified': new Date().toUTCString(),
        'ETag': `W/"${timestamp}"` // Add ETag for cache validation
      }
    });

  } catch (error) {
    console.error("Error reloading users:", error);
    return NextResponse.json(
      { error: "Failed to reload users" },
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
