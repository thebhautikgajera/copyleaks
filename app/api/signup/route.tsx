import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import SignUp from '../../../models/signUpSchema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password, confirmPassword } = body;

    // Connect to MongoDB
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in the environment variables');
    }
    await mongoose.connect(process.env.MONGO_URI);

    // Create a new user
    const newUser = new SignUp({
      username,
      email,
      password,
      confirmPassword
    });

    // Save the user to the database
    await newUser.save();

    // Disconnect from MongoDB
    await mongoose.disconnect();

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    // Disconnect from MongoDB in case of error
    await mongoose.disconnect();

    if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json({ error: validationErrors }, { status: 400 });
    }

    if (error instanceof mongoose.mongo.MongoError && error.code === 11000) {
      // Duplicate key error (username or email already exists)
      return NextResponse.json({ error: 'Username or email already exists' }, { status: 400 });
    }

    // Generic error
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'An error occurred during signup' }, { status: 500 });
  }
}
