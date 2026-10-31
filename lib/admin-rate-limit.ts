import 'server-only'
import { createHmac } from 'crypto'
import { headers } from 'next/headers'
import { createServiceClient } from '@/lib/supabase/service'

// Rate limiting for admin credential checks (login, change-password).
//
// Failed attempts are stored in Supabase (admin_login_attempts) so the limit
// holds across serverless instances. If that table is unavailable (migration
// not applied, no service role key) we fall back to a per-instance in-memory
// counter, which is weaker but never leaves the endpoint unlimited.

export type AttemptScope = 'login' | 'change-password'

const WINDOW_MS = 15 * 60 * 1000
const MAX_FAILURES_PER_IP = 5
// Caps distributed guessing from many IPs against the single admin account.
const MAX_FAILURES_GLOBAL = 50

const TABLE = 'admin_login_attempts'

async function clientIpHash(): Promise<string> {
    const h = await headers()
    const ip =
        h.get('x-real-ip') ??
        h.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        'unknown'
    const key = process.env.ADMIN_SESSION_SECRET ?? 'foodai-admin-rate-limit'
    return createHmac('sha256', key).update(ip).digest('hex')
}

// --- in-memory fallback ----------------------------------------------------

const memoryFailures = new Map<string, number[]>()

function memoryRecent(key: string, since: number): number[] {
    const recent = (memoryFailures.get(key) ?? []).filter((t) => t > since)
    memoryFailures.set(key, recent)
    return recent
}

// --- public API --------------------------------------------------------------

export type RateLimitCheck = { allowed: true; ipHash: string } | { allowed: false; ipHash: string }

export async function checkAdminRateLimit(scope: AttemptScope): Promise<RateLimitCheck> {
    const ipHash = await clientIpHash()
    const sinceMs = Date.now() - WINDOW_MS

    try {
        const sb = createServiceClient()
        const since = new Date(sinceMs).toISOString()
        const [perIp, global] = await Promise.all([
            sb.from(TABLE).select('id', { count: 'exact', head: true })
                .eq('scope', scope).eq('ip_hash', ipHash).gte('created_at', since),
            sb.from(TABLE).select('id', { count: 'exact', head: true })
                .eq('scope', scope).gte('created_at', since),
        ])
        if (perIp.error || global.error) throw perIp.error ?? global.error
        const allowed =
            (perIp.count ?? 0) < MAX_FAILURES_PER_IP && (global.count ?? 0) < MAX_FAILURES_GLOBAL
        return { allowed, ipHash }
    } catch {
        const perIp = memoryRecent(`${scope}:${ipHash}`, sinceMs).length
        const global = memoryRecent(scope, sinceMs).length
        return { allowed: perIp < MAX_FAILURES_PER_IP && global < MAX_FAILURES_GLOBAL, ipHash }
    }
}

export async function recordAdminFailure(scope: AttemptScope, ipHash: string): Promise<void> {
    const now = Date.now()
    try {
        const sb = createServiceClient()
        const { error } = await sb.from(TABLE).insert({ scope, ip_hash: ipHash })
        if (error) throw error
        // Opportunistic cleanup so the table stays small.
        await sb.from(TABLE).delete().lt('created_at', new Date(now - 24 * 60 * 60 * 1000).toISOString())
    } catch {
        for (const key of [`${scope}:${ipHash}`, scope]) {
            memoryFailures.set(key, [...memoryRecent(key, now - WINDOW_MS), now])
        }
    }
}

export const RATE_LIMIT_MESSAGE =
    'Liian monta epäonnistunutta yritystä. Yritä uudelleen 15 minuutin kuluttua.'
