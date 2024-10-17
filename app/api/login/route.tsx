import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import SignUp from '../../../models/signUpSchema';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
    try {
        await dbConnect();

        const { email, password } = await req.json();

        // Find user by email
        const user = await SignUp.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
        }

        // Login successful
        return NextResponse.json({ message: 'Login successful', userId: user._id }, { status: 200 });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
    }
}

