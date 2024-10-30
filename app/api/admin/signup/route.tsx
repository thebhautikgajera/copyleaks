import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import connectToDatabase from '../../../../lib/connectToDatabase';
import AdminRegister from '../../../../models/adminRegisterSchema';

export async function POST(req: Request) {
  try {
    const { username, email, password, confirmPassword } = await req.json();

    // Validate input
    if (!username || !email || !password || !confirmPassword) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ message: 'Passwords do not match' }, { status: 400 });
    }

    // Convert username to lowercase
    const lowercaseUsername = username.toLowerCase();

    // Connect to the database
    await connectToDatabase();

    // Check if admin already exists
    const existingAdmin = await AdminRegister.findOne({ $or: [{ username: lowercaseUsername }, { email }] });
    if (existingAdmin) {
      return NextResponse.json({ message: 'Username or email already exists' }, { status: 400 });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin
    const newAdmin = new AdminRegister({
      username: lowercaseUsername,
      email,
      password: hashedPassword,
      confirmPassword: hashedPassword
    });

    // Save admin to database
    await newAdmin.save();

    return NextResponse.json({ message: 'Admin registered successfully' }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'An error occurred during registration' }, { status: 500 });
  }
}
