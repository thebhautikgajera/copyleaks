import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../lib/connectToDatabase';
import ContactForm from '../../../../../models/contactFormSchema';

export async function GET() {
  try {
    await connectToDatabase();
    
    const count = await ContactForm.countDocuments({}, { maxTimeMS: 30000 });
    
    return new NextResponse(JSON.stringify({ count }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('Error getting contact form count:', error);
    return NextResponse.json(
      { error: 'Failed to get contact form count' },
      { status: 500 }
    );
  }
}
