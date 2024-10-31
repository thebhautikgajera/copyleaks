import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/connectToDatabase';
import Register from '../../../../models/registerSchema';

export async function GET() {
  try {
    await connectToDatabase();
    
    const count = await Register.countDocuments();
    
    return NextResponse.json({ count }, { status: 200 });

  } catch (error) {
    console.error('Error getting user count:', error);
    return NextResponse.json(
      { error: 'Failed to get user count' },
      { status: 500 }
    );
  }
}

