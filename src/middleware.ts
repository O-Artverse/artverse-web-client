import { NextRequest, NextResponse } from 'next/server';
import constants from './settings/constants'; // dùng nếu bạn cần constant.ACCESS_TOKEN

// Các route cần đăng nhập
const protectedRoutes: string[] = [
  '/explore',
  '/business',
  '/albums',
];

// Các trang auth/public
const authPages = ['/sign-in', '/sign-up', '/login', '/callback', '/error', '/'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(constants.ACCESS_TOKEN || 'accessToken')?.value;

  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthPage = authPages.some(route => pathname === route || pathname.startsWith(route));

  if (!token && isProtected) {
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('redirectTo', encodeURIComponent(request.url));
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);
  return response;
}

export const config = {
  matcher: ['/', '/:path*'],
};
