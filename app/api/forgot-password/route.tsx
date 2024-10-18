import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import SignUp from '../../../models/signUpSchema';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
    try {
        await dbConnect();

        const { email, newPassword } = await req.json();

        // Find user by email
        const user = await SignUp.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        return NextResponse.json({ message: 'Password reset successful' }, { status: 200 });
    } catch (error) {
        console.error('Password reset error:', error);
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
    }
}
