import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/connectToDatabase';
import Register from '../../../../models/registerSchema';

export async function GET() {
  try {
    await connectToDatabase();

    // Add error handling for database connection
    if (!Register) {
      throw new Error('Database model not initialized');
    }

    // Use find() with lean() for better performance and accurate count
    const users = await Register.find(
      {},
      null,
      {
        maxTimeMS: 30000,
        strict: true,
        lean: true
      }
    );

    const count = users.length;

    // Validate count result
    if (typeof count !== 'number') {
      throw new Error('Invalid count result');
    }

    return NextResponse.json(
      { count },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );

  } catch (error: unknown) {
    console.error('Error getting user count:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get user count',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
