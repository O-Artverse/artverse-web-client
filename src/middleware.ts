import { NextRequest, NextResponse } from 'next/server';
import constants from './settings/constants';

// Các route cần đăng nhập
const protectedRoutes: string[] = [
  '/explore',
  '/albums',
];

// Các route chỉ dành cho BUSINESS và ADMIN
const businessRoutes: string[] = [
  '/business',
];

// Các trang auth/public
const authPages = ['/sign-in', '/sign-up', '/login', '/callback', '/error', '/'];

function parseJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(constants.ACCESS_TOKEN || 'accessToken')?.value;

  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  const isBusiness = businessRoutes.some(route => pathname.startsWith(route));
  const isAuthPage = authPages.some(route => pathname === route || pathname.startsWith(route));

  // Check if user needs to be authenticated
  if (!token && (isProtected || isBusiness)) {
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('redirectTo', encodeURIComponent(request.url));
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based access for business routes
  if (token && isBusiness) {
    const payload = parseJWT(token);

    if (!payload || !payload.role) {
      // Invalid token, redirect to login
      const loginUrl = new URL('/', request.url);
      return NextResponse.redirect(loginUrl);
    }

    if (payload.role !== 'BUSINESS' && payload.role !== 'ADMIN') {
      // User doesn't have business role, redirect to explore with error
      const unauthorizedUrl = new URL('/explore', request.url);
      unauthorizedUrl.searchParams.set('error', 'insufficient_permissions');
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);

  // Add user role to headers for easier access in components
  if (token) {
    const payload = parseJWT(token);
    if (payload?.role) {
      response.headers.set('x-user-role', payload.role);
      response.headers.set('x-business-type', payload.businessType || '');
    }
  }

  return response;
}

export const config = {
  matcher: ['/', '/:path*'],
};
