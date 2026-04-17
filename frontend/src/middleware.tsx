// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
  const { pathname } = request.nextUrl;

  // Các route công khai
  const publicPaths = ['/login', '/register'];
  if (publicPaths.includes(pathname)) {
    if (token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Route admin: chỉ cần có token là cho qua (role sẽ kiểm tra ở client)
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Có token -> cho phép vào admin
    return NextResponse.next();
  }

  // Các route cần đăng nhập (trang cá nhân, yêu thích...)
  const protectedPaths = ['/profile', '/favorites'];
  if (protectedPaths.some(p => pathname.startsWith(p))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};