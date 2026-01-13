import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session')?.value;

    // Public routes
    if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/_next')) {
        return NextResponse.next();
    }

    // Check auth
    if (!session) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        // Just check if it decrypts successfully
        await decrypt(session);
    } catch (err) {
        // Invalid session
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
