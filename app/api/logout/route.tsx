import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Clear the authentication cookie
    cookies().delete('authToken');

    // Return a success response
    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error during logout:', error);
    // If there's an error, return a 500 Internal Server Error
    return NextResponse.json({ error: 'An error occurred during logout' }, { status: 500 });
  }
}
