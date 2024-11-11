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

    // Force authentication for all other admin routes
    if (!authToken) {
      // Store the current URL before redirecting
      const currentUrl = request.nextUrl.pathname + request.nextUrl.search;
      const loginUrl = new URL('/admin-login', request.url);
      loginUrl.searchParams.set('returnUrl', currentUrl);
      return NextResponse.redirect(loginUrl);
    }

    // Verify token and allow access
    if (authToken) {
      return NextResponse.next();
    } else {
      // If verification fails, redirect to login and clear cookies
      const response = NextResponse.redirect(new URL('/admin-login', request.url));
      response.cookies.delete('authToken');
      return response;
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

  // Check if user is leaving admin pages and clear admin auth
  if (authToken && !pathname.startsWith('/admin')) {
    const response = NextResponse.next();
    response.cookies.delete('authToken');
    return response;
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