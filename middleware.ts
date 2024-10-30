import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of protected routes
const protectedRoutes = ['/home', '/about', '/pricing', '/contact'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get('session')?.value;
  const authToken = request.cookies.get('authToken')?.value;

  // Admin routes middleware
  if (pathname.startsWith('/admin')) {
    // Admin dashboard and signup protection
    if (pathname === '/admin' || pathname === '/admin-signup') {
      if (!authToken) {
        return NextResponse.redirect(new URL('/admin-login', request.url));
      }
    }

    // Redirect logged in admin away from login
    if (pathname === '/admin-login' && authToken) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    // Allow access to admin-login
    if (pathname === '/admin-login') {
      return NextResponse.next();
    }
  }

  // Regular user routes middleware
  if (protectedRoutes.includes(pathname)) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  if ((pathname === '/login' || pathname === '/register') && sessionToken) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/home',
    '/admin',
    '/admin-login', 
    '/admin-signup',
    '/about',
    '/pricing',
    '/contact'
  ],
};