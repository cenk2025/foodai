import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdminCredentials } from '@/lib/admin-auth'
import {
    ADMIN_COOKIE,
    ADMIN_SESSION_TTL_SECONDS,
    createAdminSessionToken,
} from '@/lib/admin-session'

export async function POST(request: Request) {
    const body = await request.json().catch(() => null)
    const email = typeof body?.email === 'string' ? body.email : ''
    const password = typeof body?.password === 'string' ? body.password : ''

    // The admin password lives in Supabase Auth (same account that the
    // forgot-password and change-password flows act on).
    const userId = await verifyAdminCredentials(email, password)

    if (userId) {
        const cookieStore = await cookies()
        cookieStore.set(ADMIN_COOKIE, await createAdminSessionToken(userId), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: ADMIN_SESSION_TTL_SECONDS,
            path: '/',
        })

        return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Virheellinen sähköposti tai salasana' }, { status: 401 })
}
