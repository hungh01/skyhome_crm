import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of protected routes
const protectedRoutes = ['/admin'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('token');
    const refreshToken = request.cookies.get('refreshToken');
    // Nếu đã đăng nhập mà vào /login thì chuyển sang /admin
    if (pathname.startsWith('/login') && token && refreshToken) {
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    // Nếu vào /admin mà không có token thì chuyển sang /login
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
        if (!token || !refreshToken) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/login'],
};