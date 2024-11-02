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
    return NextResponse.redirect(new URL('/404', request.url));
  }

  // Admin routes middleware
  if (pathname.startsWith('/admin')) {
    // Allow access to admin-login
    if (pathname === '/admin-login') {
      if (authToken) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }

    // Protect all other admin routes
    if (!authToken) {
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