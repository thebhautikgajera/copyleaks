import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import connectToDatabase from '../../../lib/connectToDatabase';
import Register from '../../../models/registerSchema';

export async function POST(req: Request) {
  try {
    const { emailOrUsername, password } = await req.json();

    // Validate input
    if (!emailOrUsername || !password) {
      return NextResponse.json({ message: 'Email/Username and password are required' }, { status: 400 });
    }

    // Connect to the database
    await connectToDatabase();

    // Find user by email or username
    const user = await Register.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });
    if (!user) {
      return NextResponse.json({ message: 'Invalid email/username or password' }, { status: 401 });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid email/username or password' }, { status: 401 });
    }

    // User authenticated successfully
    return NextResponse.json({ message: 'Login successful', user: { id: user._id, username: user.username, email: user.email } }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'An error occurred during login' }, { status: 500 });
  }
}
