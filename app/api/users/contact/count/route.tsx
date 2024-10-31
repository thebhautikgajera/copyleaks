import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../lib/connectToDatabase';
import ContactForm from '../../../../../models/contactFormSchema';

export async function GET() {
  try {
    await connectToDatabase();
    
    const count = await ContactForm.countDocuments();
    
    return NextResponse.json({ count }, { status: 200 });

  } catch (error) {
    console.error('Error getting contact form count:', error);
    return NextResponse.json(
      { error: 'Failed to get contact form count' },
      { status: 500 }
    );
  }
}
