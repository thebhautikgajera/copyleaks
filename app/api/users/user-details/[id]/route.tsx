import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/connectToDatabase";
import User from "../../../../../models/registerSchema";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const id = params.id;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Error deleting user" },
      { status: 500 }
    );
  }
}
