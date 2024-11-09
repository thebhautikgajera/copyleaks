import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of protected routes
const protectedRoutes = ['/home', '/about', '/pricing', '/contact'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get('session')?.value;
  const authToken = request.cookies.get('authToken')?.value;

  // Block admin-signup completely
  if (pathname === '/admin-signup') {
    return NextResponse.redirect(new URL('/admin-login', request.url));
  }

  // Enhanced admin routes middleware with strict checking
  if (pathname.startsWith('/admin')) {
    // Special handling for admin-login page
    if (pathname === '/admin-login') {
      if (authToken) {
        // If already authenticated, go to admin dashboard
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }

    // Force authentication for all admin routes
    if (!authToken) {
      const currentUrl = request.nextUrl.pathname;
      const loginUrl = new URL('/admin-login', request.url);
      // Store attempted URL as a query parameter
      loginUrl.searchParams.set('returnUrl', currentUrl);
      return NextResponse.redirect(loginUrl);
    }

    // Additional verification for admin routes
    try {
      // Allow access if authToken exists
      return NextResponse.next();
    } catch {
      // If any verification fails, redirect to login
      return NextResponse.redirect(new URL('/admin-login', request.url));
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
    '/admin/overview',
    '/admin/users', 
    '/admin/message',
    '/admin-signup',
    '/about',
    '/pricing',
    '/contact'
  ],
};