import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get('session');
    const session = sessionCookie?.value;
    const pathname = request.nextUrl.pathname;

    // Public routes - allow login and static assets
    if (pathname.startsWith('/login') || pathname.startsWith('/_next')) {
        return NextResponse.next();
    }

    // Check auth - if no session or empty session, redirect to login
    if (!session || session.trim() === '') {
        const response = NextResponse.redirect(new URL('/login', request.url));
        // Ensure cookie is deleted in response
        response.cookies.delete('session');
        response.cookies.set('session', '', {
            expires: new Date(0),
            httpOnly: true,
            path: '/',
            sameSite: 'lax',
            maxAge: 0,
        });
        return response;
    }

    let user;
    try {
        // Decrypt and get user info
        const payload = await decrypt(session);
        user = payload?.user;
    } catch (err) {
        // Invalid session - clear it and redirect to login
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.set('session', '', {
            expires: new Date(0),
            httpOnly: true,
            path: '/',
            sameSite: 'lax',
            maxAge: 0,
        });
        return response;
    }

    // Money routes are accessible to all authenticated users
    if (pathname.startsWith('/money')) {
        return NextResponse.next();
    }

    // Block access to disabled routes (Communication, Review)
    if (pathname.startsWith('/communication') || pathname.startsWith('/review')) {
        // Redirect to home for admin, or money for non-admin
        if (user?.username === 'akshat') {
            return NextResponse.redirect(new URL('/', request.url));
        } else {
            return NextResponse.redirect(new URL('/money', request.url));
        }
    }

    // All other routes require admin access (username: akshat)
    if (user?.username !== 'akshat') {
        // Redirect non-admin users to money page
        return NextResponse.redirect(new URL('/money', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
