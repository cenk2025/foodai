import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_COOKIE, verifyAdminSessionToken } from '@/lib/admin-session'

export async function middleware(request: NextRequest) {
    // Only protect /admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {

        // Allow access to login page
        if (request.nextUrl.pathname === '/admin/login') {
            return NextResponse.next()
        }

        // Require a validly signed, unexpired admin session cookie
        const session = await verifyAdminSessionToken(request.cookies.get(ADMIN_COOKIE)?.value)

        if (!session) {
            // Redirect to login if no session
            const response = NextResponse.redirect(new URL('/admin/login', request.url))
            response.cookies.delete(ADMIN_COOKIE)
            return response
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/admin/:path*',
}
