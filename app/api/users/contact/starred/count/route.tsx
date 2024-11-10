import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../../lib/connectToDatabase";
import Contact from "../../../../../../models/contactFormSchema";

export async function GET() {
  try {
    await connectToDatabase();

    // Add error handling for database connection
    if (!Contact) {
      throw new Error('Database model not initialized');
    }

    // Use countDocuments for accurate count of starred messages
    const count = await Contact.countDocuments({ 
      isStarred: true 
    });

    // Validate count result
    if (typeof count !== 'number') {
      throw new Error('Invalid count result');
    }

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
    console.error("Error fetching starred count:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch starred count",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
