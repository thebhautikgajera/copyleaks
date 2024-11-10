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

    // Use aggregate to count read messages
    const result = await Contact.aggregate([
      {
        $match: {
          isRead: true
        }
      },
      {
        $count: "total"
      }
    ], {
      maxTimeMS: 30000
    });

    // Extract count from aggregate result
    const count = result[0]?.total || 0;

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
    console.error("Error getting read message count:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch read count",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
