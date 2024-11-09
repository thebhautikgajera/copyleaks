import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../../lib/connectToDatabase";
import Contact from "../../../../../../models/contactFormSchema";

export async function GET() {
  try {
    await connectToDatabase();

    // Set cache control headers to prevent caching
    const headers = {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };

    // Count documents where isStarred is true
    const count = await Contact.countDocuments({ isStarred: true });

    return new NextResponse(JSON.stringify({ count }), {
      headers: headers,
      status: 200
    });

  } catch (error) {
    console.error("Error fetching starred count:", error);
    return NextResponse.json(
      { error: "Failed to fetch starred count" },
      { status: 500 }
    );
  }
}
