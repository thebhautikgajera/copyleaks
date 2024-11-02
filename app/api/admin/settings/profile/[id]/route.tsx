import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../../lib/connectToDatabase";
import Admin from "../../../../../../models/adminRegisterSchema";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to database
    await connectToDatabase();

    const updateData = await request.json();
    const { id } = params;

    // Find and update the admin
    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedAdmin) {
      return NextResponse.json(
        { error: "Admin not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Admin updated successfully", admin: updatedAdmin },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating admin:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
