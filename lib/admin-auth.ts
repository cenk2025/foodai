import 'server-only'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE, verifyAdminSessionToken } from './admin-session'

export class AdminUnauthorizedError extends Error {
    constructor() {
        super('Unauthorized')
    }
}

// Returns the admin's Supabase user id if the request carries a valid signed
// admin session, else null.
export async function getAdminUserId(): Promise<string | null> {
    const cookieStore = await cookies()
    const session = await verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE)?.value)
    return session?.sub ?? null
}

// Server actions are plain POST endpoints that can be called directly, so each
// admin action must check the session itself instead of relying on middleware.
export async function requireAdmin(): Promise<string> {
    const userId = await getAdminUserId()
    if (!userId) throw new AdminUnauthorizedError()
    return userId
}

// Verifies the admin's email + password against Supabase Auth. Returns the
// Supabase user id on success.
export async function verifyAdminCredentials(
    email: string,
    password: string,
): Promise<string | null> {
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!adminEmail || !supabaseUrl || !anonKey) return null
    if (email.trim().toLowerCase() !== adminEmail || !password) return null

    const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: anonKey },
        body: JSON.stringify({ email: adminEmail, password }),
        cache: 'no-store',
    })
    if (!res.ok) return null
    const data = (await res.json()) as { user?: { id?: string } }
    return data.user?.id ?? null
}
