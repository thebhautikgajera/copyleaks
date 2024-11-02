import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../../lib/connectToDatabase";
import Contact from "../../../../../../models/contactFormSchema";

export async function GET() {
  try {
    await connectToDatabase();

    const count = await Contact.countDocuments({ isRead: true });

    return NextResponse.json({ count });

  } catch (error) {
    console.error("Error getting read message count:", error);
    return NextResponse.json(
      { error: "Failed to fetch read count" },
      { status: 500 }
    );
  }
}
