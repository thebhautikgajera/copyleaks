import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/connectToDatabase';
import AdminRegisterSchema from '../../../../models/adminRegisterSchema';

export async function GET() {
  try {
    await connectToDatabase();
    
    const count = await AdminRegisterSchema.countDocuments();

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error getting admin count:', error);
    return NextResponse.json(
      { error: 'Failed to get admin count' },
      { status: 500 }
    );
  }
}
