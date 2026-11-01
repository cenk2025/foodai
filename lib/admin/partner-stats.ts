import 'server-only'
import { createServiceClient } from '@/lib/supabase/service'

const PAGE_SIZE = 1000
const TOP_OFFERS = 10
const TIME_ZONE = 'Europe/Helsinki'

export const STAT_RANGES = [7, 30, 90] as const
export type StatRange = (typeof STAT_RANGES)[number]

export type PartnerRow = { id: string; name: string; clicks: number; views: number; ctr: number | null; activeOffers: number }
export type OfferRow = { id: string; meal: string; partner: string; city: string; clicks: number; views: number; ctr: number | null }
export type DayRow = { day: string; label: string; clicks: number; views: number }
export type CityRow = { name: string; clicks: number }

export type PartnerStats = {
    partners: PartnerRow[]
    selected: PartnerRow | null
    totals: { clicks: number; views: number; ctr: number | null; activeOffers: number }
    daily: DayRow[]
    topOffers: OfferRow[]
    cities: CityRow[]
}

type OfferMeta = {
    id: string
    source_id: string
    active: boolean
    meal: { name: string } | null
    city: { name: string } | null
}

type StatRow = { day: string; offer_id: string; clicks: number; views: number }

const clickRate = (clicks: number, views: number) => (views > 0 ? clicks / views : null)

// Supabase caps a response at 1000 rows, so anything that can grow is read in pages.
async function readAll<T>(readPage: (from: number, to: number) => PromiseLike<{ data: unknown; error: { message: string } | null }>) {
    const rows: T[] = []
    for (let from = 0; ; from += PAGE_SIZE) {
        const { data, error } = await readPage(from, from + PAGE_SIZE - 1)
        if (error) throw new Error(error.message)
        const page = (data ?? []) as T[]
        rows.push(...page)
        if (page.length < PAGE_SIZE) return rows
    }
}

// Calendar days in Helsinki, oldest first, as YYYY-MM-DD.
function lastDays(count: number): string[] {
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(new Date())
    const end = Date.parse(`${today}T00:00:00Z`)
    return Array.from({ length: count }, (_, i) =>
        new Date(end - (count - 1 - i) * 86_400_000).toISOString().slice(0, 10))
}

function dayLabel(day: string): string {
    const [, month, date] = day.split('-')
    return `${Number(date)}.${Number(month)}.`
}

// Real partners only: demo sources hold example data and are never tracked.
export async function getPartnerStats(range: StatRange, partnerId?: string): Promise<PartnerStats> {
    const sb = createServiceClient()
    const days = lastDays(range)

    const { data: sourceData, error: sourceError } = await sb.from('sources').select('id, name').neq('type', 'demo').order('name')
    if (sourceError) throw new Error(sourceError.message)
    const sources = (sourceData ?? []) as { id: string; name: string }[]
    const sourceNames = new Map(sources.map(source => [source.id, source.name]))

    const offers = sources.length === 0 ? [] : await readAll<OfferMeta>((from, to) =>
        sb.from('offers')
            .select('id, source_id, active, meal:meals(name), city:cities(name)')
            .in('source_id', sources.map(source => source.id))
            .order('id')
            .range(from, to))
    const offerById = new Map(offers.map(offer => [offer.id, offer]))

    const stats = await readAll<StatRow>((from, to) =>
        sb.rpc('admin_offer_daily_stats', { p_from: days[0] }).range(from, to))

    const clicksByPartner = new Map<string, { clicks: number; views: number }>()
    const selectedId = partnerId && sourceNames.has(partnerId) ? partnerId : null
    const byDay = new Map(days.map(day => [day, { clicks: 0, views: 0 }]))
    const byOffer = new Map<string, { clicks: number; views: number }>()
    const byCity = new Map<string, number>()

    for (const row of stats) {
        const offer = offerById.get(row.offer_id)
        if (!offer) continue
        const clicks = Number(row.clicks)
        const views = Number(row.views)

        const partner = clicksByPartner.get(offer.source_id) ?? { clicks: 0, views: 0 }
        partner.clicks += clicks
        partner.views += views
        clicksByPartner.set(offer.source_id, partner)

        if (selectedId && offer.source_id !== selectedId) continue

        const dayTotal = byDay.get(row.day)
        if (dayTotal) {
            dayTotal.clicks += clicks
            dayTotal.views += views
        }
        const offerTotal = byOffer.get(row.offer_id) ?? { clicks: 0, views: 0 }
        offerTotal.clicks += clicks
        offerTotal.views += views
        byOffer.set(row.offer_id, offerTotal)

        const city = offer.city?.name ?? '–'
        byCity.set(city, (byCity.get(city) ?? 0) + clicks)
    }

    const partners = sources.map((source): PartnerRow => {
        const { clicks, views } = clicksByPartner.get(source.id) ?? { clicks: 0, views: 0 }
        return {
            id: source.id,
            name: source.name,
            clicks,
            views,
            ctr: clickRate(clicks, views),
            activeOffers: offers.filter(offer => offer.source_id === source.id && offer.active).length,
        }
    }).sort((a, b) => b.clicks - a.clicks || b.views - a.views)

    const shown = selectedId ? partners.filter(partner => partner.id === selectedId) : partners
    const clicks = shown.reduce((sum, partner) => sum + partner.clicks, 0)
    const views = shown.reduce((sum, partner) => sum + partner.views, 0)

    return {
        partners,
        selected: selectedId ? shown[0] : null,
        totals: {
            clicks,
            views,
            ctr: clickRate(clicks, views),
            activeOffers: shown.reduce((sum, partner) => sum + partner.activeOffers, 0),
        },
        daily: days.map(day => ({ day, label: dayLabel(day), ...byDay.get(day)! })),
        topOffers: [...byOffer.entries()]
            .map(([id, total]): OfferRow => {
                const offer = offerById.get(id)!
                return {
                    id,
                    meal: offer.meal?.name ?? '–',
                    partner: sourceNames.get(offer.source_id) ?? '–',
                    city: offer.city?.name ?? '–',
                    ...total,
                    ctr: clickRate(total.clicks, total.views),
                }
            })
            .sort((a, b) => b.clicks - a.clicks || b.views - a.views)
            .slice(0, TOP_OFFERS),
        cities: [...byCity.entries()]
            .map(([name, cityClicks]) => ({ name, clicks: cityClicks }))
            .filter(city => city.clicks > 0)
            .sort((a, b) => b.clicks - a.clicks),
    }
}
