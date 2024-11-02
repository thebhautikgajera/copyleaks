import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../../lib/connectToDatabase";
import Contact from "../../../../../../models/contactFormSchema";

export async function GET() {
  try {
    await connectToDatabase();

    // Count documents where isStarred is true
    const count = await Contact.countDocuments({ isStarred: true });

    return NextResponse.json({ count });

  } catch (error) {
    console.error("Error fetching starred count:", error);
    return NextResponse.json(
      { error: "Failed to fetch starred count" },
      { status: 500 }
    );
  }
}
