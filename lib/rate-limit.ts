import 'server-only'
import { createHmac } from 'crypto'
import { headers } from 'next/headers'
import { createServiceClient } from '@/lib/supabase/service'

// Per-IP request limit for public endpoints that cost money per call (AI).
//
// Every request is recorded in Supabase (rate_limit_events) so the limit holds
// across serverless instances; if that table is unavailable we fall back to a
// per-instance in-memory counter. Only a keyed hash of the IP is stored.

const TABLE = 'rate_limit_events'

type Limit = { scope: string; max: number; windowMs: number }

// Keyed hash of the visitor's IP, so stored values can't be turned back into addresses.
export async function clientKey(): Promise<string> {
    const h = await headers()
    const ip =
        h.get('x-real-ip') ??
        h.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        'unknown'
    const secret = process.env.ADMIN_SESSION_SECRET ?? 'foodai-rate-limit'
    return createHmac('sha256', secret).update(ip).digest('hex')
}

const memoryEvents = new Map<string, number[]>()

function memoryHit(key: string, { max, windowMs }: Limit): boolean {
    const now = Date.now()
    const recent = (memoryEvents.get(key) ?? []).filter((t) => t > now - windowMs)
    if (recent.length >= max) {
        memoryEvents.set(key, recent)
        return false
    }
    memoryEvents.set(key, [...recent, now])
    return true
}

// Returns true and records the request if it is within the limit.
export async function takeRateLimit(limit: Limit): Promise<boolean> {
    const keyHash = await clientKey()
    try {
        const sb = createServiceClient()
        const since = new Date(Date.now() - limit.windowMs).toISOString()
        const { count, error } = await sb
            .from(TABLE)
            .select('id', { count: 'exact', head: true })
            .eq('scope', limit.scope)
            .eq('key_hash', keyHash)
            .gte('created_at', since)
        if (error) throw error
        if ((count ?? 0) >= limit.max) return false

        const { error: insertError } = await sb.from(TABLE).insert({ scope: limit.scope, key_hash: keyHash })
        if (insertError) throw insertError
        // Opportunistic cleanup so the table stays small.
        if (Math.random() < 0.05) {
            await sb.from(TABLE).delete().lt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        }
        return true
    } catch {
        return memoryHit(`${limit.scope}:${keyHash}`, limit)
    }
}
