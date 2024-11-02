import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../../../lib/connectToDatabase";
import Admin from "../../../../../../../models/adminRegisterSchema";
import * as bcrypt from "bcrypt"; // Using bcrypt instead of bcryptjs

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to database
    await connectToDatabase();

    const { currentPassword, newPassword } = await request.json();
    const { id } = params;

    // Find the admin
    const admin = await Admin.findById(id);

    if (!admin) {
      return NextResponse.json(
        { error: "Admin not found" },
        { status: 404 }
      );
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await Admin.findByIdAndUpdate(
      id,
      { $set: { password: hashedPassword } },
      { new: true }
    );

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

