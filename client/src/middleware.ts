import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/signup');
    const isChatPage = request.nextUrl.pathname.startsWith('/chat');

    // Redirect to login if accessing chat without auth
    if (isChatPage && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Redirect to chat if accessing auth pages while authenticated
    if (isAuthPage && token) {
        return NextResponse.redirect(new URL('/chat', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
