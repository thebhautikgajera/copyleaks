import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/connectToDatabase';
import AdminRegisterSchema from '../../../../models/adminRegisterSchema';

export async function GET() {
  try {
    await connectToDatabase();

    // Add error handling for database connection
    if (!AdminRegisterSchema) {
      throw new Error('Database model not initialized');
    }

    // Use aggregate to get accurate count
    const result = await AdminRegisterSchema.aggregate([
      {
        $count: "total"
      }
    ], {
      maxTimeMS: 30000 // Add timeout to prevent long-running queries
    });

    // Extract count from aggregate result
    const count = result[0]?.total || 0;

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

  } catch (error) {
    console.error('Error getting admin count:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get admin count',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
