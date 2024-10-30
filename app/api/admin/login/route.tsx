import { NextResponse } from 'next/server'
import Admin from '../../../../models/adminRegisterSchema'
import connectDB from '../../../../lib/connectToDatabase'
import bcrypt from 'bcrypt'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    await connectDB()

    const body = await req.json()
    const { emailOrUsername, password } = body

    // Validate required fields
    if (!emailOrUsername || !password) {
      return NextResponse.json(
        { message: 'Email/username and password are required' },
        { status: 400 }
      )
    }

    // Find admin by email or username
    const admin = await Admin.findOne({
      $or: [
        { email: emailOrUsername.toLowerCase() },
        { username: emailOrUsername }
      ]
    })

    if (!admin) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Compare passwords
    const isValidPassword = await bcrypt.compare(password, admin.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Remove password from response
    const adminResponse = {
      email: admin.email,
      username: admin.username,
      createdAt: admin.createdAt
    }

    // Create a simple session token using timestamp and admin id
    const token = Buffer.from(`${admin._id}-${Date.now()}`).toString('base64')

    // Set the token in cookies
    cookies().set('authToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    })

    const response = NextResponse.json(
      {
        message: 'Login successful',
        admin: adminResponse,
        redirectUrl: '/admin'
      },
      { status: 200 }
    )

    // Set additional headers for redirection
    response.headers.set('Location', '/admin')
    response.headers.set('X-Redirect', 'true')

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Error during login' },
      { status: 500 }
    )
  }
}
