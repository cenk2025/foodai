import { NextResponse } from 'next/server'
import { takeRateLimit } from '@/lib/rate-limit'
import { createServiceClient } from '@/lib/supabase/service'

const MAX_IDS = 50
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Counts offers shown to a visitor. Nothing about the visitor is stored with the
// count, and a failure here must never affect the page, so errors stay server-side.
export async function POST(request: Request) {
    const body = (await request.json().catch(() => null)) as { ids?: unknown } | null
    const ids = Array.isArray(body?.ids)
        ? body.ids.filter((id): id is string => typeof id === 'string' && UUID_PATTERN.test(id))
        : []
    if (ids.length === 0 || ids.length > MAX_IDS) {
        return NextResponse.json({ error: 'invalid_request' }, { status: 400 })
    }

    if (!(await takeRateLimit({ scope: 'offer-views', max: 120, windowMs: 10 * 60 * 1000 }))) {
        return new NextResponse(null, { status: 204 })
    }

    const { error } = await createServiceClient().rpc('record_offer_views', { p_offer_ids: ids })
    if (error) console.error('Error recording offer views:', error.message)
    return new NextResponse(null, { status: 204 })
}
