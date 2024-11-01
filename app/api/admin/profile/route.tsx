import { NextResponse } from "next/server";
import connectDB from "../../../../lib/connectToDatabase";
import { Schema, model, models } from 'mongoose';

// Define AdminRegister schema if it doesn't exist
const AdminSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String, 
    required: true,
    unique: true
  }
});

// Get or create model
const AdminRegister = models.AdminRegister || model('AdminRegister', AdminSchema);

export async function GET() {
  try {
    await connectDB();

    // Get the first admin user from the database
    const adminUser = await AdminRegister.findOne({});

    if (!adminUser) {
      return NextResponse.json(
        { error: "Admin user not found" },
        { status: 404 }
      );
    }

    // Return only necessary profile fields
    return NextResponse.json({
      username: adminUser.username,
      email: adminUser.email
    });

  } catch (error) {
    console.error("Error fetching admin profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { username, email, newUsername, newEmail } = body;

    // Get and update the first admin user
    const adminUser = await AdminRegister.findOne({ 
      username: username,
      email: email 
    });

    if (!adminUser) {
      return NextResponse.json(
        { error: "Admin user not found" },
        { status: 404 }
      );
    }

    // Check if new username is already taken
    if (newUsername) {
      const existingUsername = await AdminRegister.findOne({ username: newUsername });
      if (existingUsername && existingUsername._id.toString() !== adminUser._id.toString()) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 400 }
        );
      }
      adminUser.username = newUsername;
    }

    // Check if new email is already taken
    if (newEmail) {
      const existingEmail = await AdminRegister.findOne({ email: newEmail });
      if (existingEmail && existingEmail._id.toString() !== adminUser._id.toString()) {
        return NextResponse.json(
          { error: "Email already taken" },
          { status: 400 }
        );
      }
      adminUser.email = newEmail;
    }

    await adminUser.save();

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        username: adminUser.username,
        email: adminUser.email
      }
    });

  } catch (error) {
    console.error("Error updating admin profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
