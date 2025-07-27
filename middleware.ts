import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Minimal middleware for redirects only - NOT for authentication
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Redirect root to login
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow all other requests to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};