import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Contact from '../../../models/contactFormSchema';

export async function POST(request: Request) {
  try {
    // Check MongoDB connection first
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined');
    }

    // Connect with error handling
    try {
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(mongoURI);
      }
    } catch (err) {
      console.error('MongoDB connection error:', err);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 503 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { name, email, subject, topic, message } = body;

    if (!name || !email || !subject || !topic || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create and save contact submission with validation
    try {
      const contact = new Contact({
        name,
        email,
        subject, 
        topic,
        message
      });

      await contact.save();

      return NextResponse.json(
        { message: 'Contact form submitted successfully' },
        { status: 200 }
      );

    } catch (validationError: unknown) {
      // Handle mongoose validation errors
      if (validationError instanceof Error && validationError.name === 'ValidationError') {
        return NextResponse.json(
          { error: validationError.message },
          { status: 400 }
        );
      }
      throw validationError;
    }

  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    // Close connection if we opened one
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  }
}
