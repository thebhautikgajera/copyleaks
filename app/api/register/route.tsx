import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import connectToDatabase from '@/lib/connectToDatabase';
import Register from '@/models/registerSchema';

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

    // Connect to the database
    await connectToDatabase();

    // Check if user already exists
    const existingUser = await Register.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return NextResponse.json({ message: 'Username or email already exists' }, { status: 400 });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new Register({
      username,
      email,
      password: hashedPassword,
      confirmPassword: hashedPassword, // Add confirmPassword field
    });

    // Save user to database
    await newUser.save();

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' }, { status: 500 });
  }
}
