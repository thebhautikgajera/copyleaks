import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../../lib/connectToDatabase";
import Contact from "../../../../../../models/contactFormSchema";

export async function GET() {
  try {
    await connectToDatabase();

    const count = await Contact.countDocuments({ isRead: true }, { maxTimeMS: 30000 });

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
    console.error("Error getting read message count:", error);
    return NextResponse.json(
      { error: "Failed to fetch read count" },
      { status: 500 }
    );
  }
}
