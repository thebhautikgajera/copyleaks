import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../lib/connectToDatabase';
import ContactForm from '../../../../../models/contactFormSchema';

export async function GET() {
  try {
    // Connect to database
    await connectToDatabase();

    // Get all contact form submissions
    const contacts = await ContactForm.find().sort({ createdAt: -1 });

    return NextResponse.json(contacts, { status: 200 });

  } catch (error) {
    console.error('Error fetching contact form data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact form data' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // Connect to database
    await connectToDatabase();

    // Get the email from the URL
    const email = request.url.split('/').pop();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Delete the contact message
    const deletedMessage = await ContactForm.findOneAndDelete({ email: email });

    if (!deletedMessage) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Message deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error deleting contact message:', error);
    return NextResponse.json(
      { error: 'Failed to delete contact message' },
      { status: 500 }
    );
  }
}