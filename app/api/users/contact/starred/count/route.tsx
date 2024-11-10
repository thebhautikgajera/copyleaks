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

    // Use find() and length instead of countDocuments
    const starredContacts = await Contact.find(
      { isStarred: true },
      null,
      { 
        maxTimeMS: 30000,
        strict: true,
        lean: true
      }
    );

    const count = starredContacts.length;

    // Validate count result
    if (typeof count !== 'number') {
      throw new Error('Invalid count result');
    }

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
