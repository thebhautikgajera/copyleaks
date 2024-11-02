import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../lib/connectToDatabase";
import Admin from "../../../../../models/adminRegisterSchema";
import { Types } from 'mongoose';

interface AdminDocument {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}

export async function GET() {
  try {
    // Connect to database
    await connectToDatabase();

    // Get all admins from the database with all fields
    const admins = await Admin.find({})
      .lean()
      .then(docs => docs.map(doc => ({
        _id: doc._id,
        username: doc.username,
        email: doc.email,
        password: doc.password,
        createdAt: doc.createdAt
      }))) as AdminDocument[];

    if (!admins || admins.length === 0) {
      return NextResponse.json(
        { error: "No admins found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ admins }, { status: 200 });

  } catch (error) {
    console.error("Error in profile route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
