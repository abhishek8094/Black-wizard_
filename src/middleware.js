import { NextResponse } from 'next/server';

export function middleware(request) {
  const protectedPaths = [
    
  ];

  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  const token = request.cookies.get('token')?.value;

  // Redirect to login if trying to access a protected route without a token
  if (isProtectedPath && !token) {
    const loginUrl = new URL('/', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Apply middleware to all routes except API, static files, and login
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
  ],
};