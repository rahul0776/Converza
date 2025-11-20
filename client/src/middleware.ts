import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/signup');
    const isProtectedPage = request.nextUrl.pathname === '/';

    // Redirect to login if accessing protected page without auth
    if (isProtectedPage && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Redirect to home if accessing auth pages while authenticated
    if (isAuthPage && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/login', '/signup'],
};
