import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../lib/connectToDatabase';
import Contact from '../../../../../models/contactFormSchema';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Add error handling for database connection
    if (!Contact) {
      throw new Error('Database model not initialized');
    }

    // Add query timeout and validation
    const count = await Contact.countDocuments(
      {}, 
      { 
        maxTimeMS: 30000,
        // Add validation to ensure count is accurate
        strict: true,
        lean: true 
      }
    );

    // Validate count result
    if (typeof count !== 'number') {
      throw new Error('Invalid count result');
    }

    return new NextResponse(JSON.stringify({ count }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error: unknown) {
    console.error('Error getting contact form count:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get contact form count',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
