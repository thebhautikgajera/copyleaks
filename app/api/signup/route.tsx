import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import SignUp from '../../../models/signUpSchema';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
    try {
        await dbConnect();

        const { username, email, password, confirmPassword } = await req.json();

        if (password !== confirmPassword) {
            return NextResponse.json({ message: 'Passwords do not match' }, { status: 400 });
        }

        const existingUser = await SignUp.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new SignUp({
            username,
            email,
            password: hashedPassword,
            confirmPassword: hashedPassword
        });

        await newUser.save();

        return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
    }
}
