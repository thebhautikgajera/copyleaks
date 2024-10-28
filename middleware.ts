import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of protected routes
const protectedRoutes = ['/home', '/about', '/pricing', '/contact'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get('session')?.value;

  // Check if the requested path is a protected route
  if (protectedRoutes.includes(pathname)) {
    // If there's no session token, redirect to login page
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // If the user is logged in and tries to access login or register page, redirect to home
  if ((pathname === '/login' || pathname === '/register') && sessionToken) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Allow access to all other routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/home',
  ],
};
