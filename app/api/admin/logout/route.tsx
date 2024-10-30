import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Create response with success message and redirect
    const response = NextResponse.json(
      { 
        message: 'Logged out successfully',
        redirectUrl: '/admin-login'
      },
      { status: 200 }
    )

    // Clear all possible auth cookies
    const cookiesToClear = [
      'token',
      'adminToken', 
      'session',
      'adminSession',
      'refreshToken',
      'adminRefreshToken',
      'authToken'
    ]

    cookiesToClear.forEach(cookieName => {
      response.cookies.set({
        name: cookieName,
        value: '',
        expires: new Date(0),
        path: '/',
      })
    })

    // Set redirect headers
    response.headers.set('Location', '/admin-login')
    response.headers.set('X-Redirect', 'true')

    return response

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { message: 'Error during logout' },
      { status: 500 }
    )
  }
}
