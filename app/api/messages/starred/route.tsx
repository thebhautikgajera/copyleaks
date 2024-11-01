import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/connectToDatabase';
import Message from '../../../../models/contactFormSchema';

export async function GET() {
  try {
    await connectToDatabase();

    const starredMessages = await Message
      .find({ starred: true })
      .select('sender content timestamp starred')
      .sort({ timestamp: -1 })
      .lean();

    if (!starredMessages?.length) {
      return NextResponse.json([]);
    }

    return NextResponse.json(starredMessages);

  } catch (error) {
    console.error('Error fetching starred messages:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching starred messages' },
      { status: 500 }
    );
  }
}
