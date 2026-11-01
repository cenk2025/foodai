import Link from 'next/link'
import { AlertCircle, ArrowRight, Eye, MousePointer2, Percent, Store, Tag } from 'lucide-react'
import { getPartnerStats, STAT_RANGES, type PartnerStats, type StatRange } from '@/lib/admin/partner-stats'
import AdminAccountActions from './AdminAccountActions'
import PartnerCharts from './PartnerCharts'

export const dynamic = 'force-dynamic'

const DEFAULT_RANGE: StatRange = 30

interface PageProps {
    searchParams: Promise<{ range?: string; partner?: string }>
}

const formatCount = (value: number) => value.toLocaleString('fi-FI')
const formatRate = (rate: number | null) =>
    rate === null ? '–' : `${(rate * 100).toLocaleString('fi-FI', { maximumFractionDigits: 1 })} %`

function dashboardHref(range: StatRange, partner?: string) {
    const params = new URLSearchParams({ range: String(range) })
    if (partner) params.set('partner', partner)
    return `/admin?${params}`
}

export default async function AdminDashboard({ searchParams }: PageProps) {
    const params = await searchParams
    const range = STAT_RANGES.find(option => String(option) === params.range) ?? DEFAULT_RANGE

    let stats: PartnerStats | null = null
    try {
        stats = await getPartnerStats(range, params.partner)
    } catch (error) {
        console.error('Error loading partner stats:', error)
    }

    return (
        <div className="min-h-screen bg-page p-6 lg:p-10 relative">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-ink">Ylläpitäjän Dashboard</h1>
                        <p className="text-subtle">Kumppaneille ohjattu liikenne viimeisten {range} päivän ajalta.</p>
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="flex items-center gap-2">
                            <AdminAccountActions />
                        </div>

                        {/* Date Filter */}
                        <nav aria-label="Aikaväli" className="bg-white p-1 rounded-xl shadow-sm border border-line flex">
                            {STAT_RANGES.map((option) => (
                                <Link
                                    key={option}
                                    href={dashboardHref(option, stats?.selected?.id)}
                                    aria-current={option === range ? 'true' : undefined}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${option === range
                                        ? 'bg-brand text-white shadow-md'
                                        : 'text-subtle hover:bg-soft hover:text-ink'
                                        }`}
                                >
                                    {option} pv
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Direct-ordering module entry */}
                <Link
                    href="/admin/restaurants"
                    className="group flex items-center gap-5 bg-white border border-line rounded-[2rem] p-6 app-shadow hover:border-brand/30 hover:-translate-y-0.5 transition-all"
                >
                    <div className="w-12 h-12 rounded-2xl bg-soft text-brand flex items-center justify-center">
                        <Store className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-black text-ink tracking-tight">
                            Ravintolat (suora tilaus)
                        </h2>
                        <p className="text-sm font-medium text-subtle">
                            Hallitse FoodAin kautta suoraan myyvien ravintoloiden menuja ja tilauksia.
                        </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-ink group-hover:text-brand transition-colors" />
                </Link>

                {!stats ? (
                    <Notice
                        title="Tilastoja ei voitu ladata"
                        text="Tarkista, että tietokantamigraatio 20261103000000_offer_views.sql on ajettu Supabasessa."
                    />
                ) : stats.partners.length === 0 ? (
                    <Notice
                        title="Ei vielä kumppaneita"
                        text="Tilastot alkavat kertyä, kun ensimmäinen kumppani on lisätty. Esimerkkitarjouksia ei lasketa mukaan."
                    />
                ) : (
                    <Dashboard stats={stats} range={range} />
                )}
            </div>
        </div>
    )
}

function Notice({ title, text }: { title: string; text: string }) {
    return (
        <div className="flex items-start gap-4 bg-white p-8 rounded-[2rem] card-shadow border border-line">
            <AlertCircle className="w-6 h-6 text-brand flex-shrink-0" />
            <div>
                <h2 className="text-lg font-black text-ink">{title}</h2>
                <p className="text-sm text-subtle">{text}</p>
            </div>
        </div>
    )
}

function Dashboard({ stats, range }: { stats: PartnerStats; range: StatRange }) {
    const { totals, selected } = stats

    return (
        <>
            {/* Partner Filter */}
            <nav aria-label="Kumppani" className="flex gap-2 overflow-x-auto no-scrollbar">
                <PartnerChip href={dashboardHref(range)} label="Kaikki kumppanit" active={!selected} />
                {stats.partners.map((partner) => (
                    <PartnerChip
                        key={partner.id}
                        href={dashboardHref(range, partner.id)}
                        label={partner.name}
                        active={selected?.id === partner.id}
                    />
                ))}
            </nav>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Klikkaukset" value={formatCount(totals.clicks)} icon={<MousePointer2 className="w-6 h-6" />} />
                <StatCard title="Näyttökerrat" value={formatCount(totals.views)} icon={<Eye className="w-6 h-6" />} />
                <StatCard title="Klikkausprosentti" value={formatRate(totals.ctr)} icon={<Percent className="w-6 h-6" />} />
                <StatCard title="Aktiiviset tarjoukset" value={formatCount(totals.activeOffers)} icon={<Tag className="w-6 h-6" />} />
            </div>

            <PartnerCharts
                daily={stats.daily}
                partners={stats.partners}
                cities={stats.cities}
                showPartners={!selected && stats.partners.length > 1}
            />

            {!selected && (
                <StatTable
                    title="Kumppanit"
                    headers={['Kumppani', 'Näyttökerrat', 'Klikkaukset', 'Klikkausprosentti', 'Aktiiviset tarjoukset']}
                    rows={stats.partners.map((partner) => ({
                        key: partner.id,
                        name: <Link href={dashboardHref(range, partner.id)} className="font-bold text-ink hover:text-brand transition-colors">{partner.name}</Link>,
                        values: [formatCount(partner.views), formatCount(partner.clicks), formatRate(partner.ctr), formatCount(partner.activeOffers)],
                    }))}
                />
            )}

            <StatTable
                title="Suosituimmat tarjoukset"
                headers={['Tarjous', 'Näyttökerrat', 'Klikkaukset', 'Klikkausprosentti']}
                emptyText="Tällä aikavälillä ei ole vielä näyttökertoja tai klikkauksia."
                rows={stats.topOffers.map((offer) => ({
                    key: offer.id,
                    name: (
                        <>
                            <span className="font-bold text-ink block">{offer.meal}</span>
                            <span className="text-xs text-subtle">{offer.partner} · {offer.city}</span>
                        </>
                    ),
                    values: [formatCount(offer.views), formatCount(offer.clicks), formatRate(offer.ctr)],
                }))}
            />

            <details className="bg-white rounded-[2rem] card-shadow border border-line p-6 md:px-8">
                <summary className="cursor-pointer font-bold text-ink">Päiväkohtaiset luvut taulukkona</summary>
                <div className="mt-4 max-h-80 overflow-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-subtle text-xs uppercase tracking-wider font-bold">
                            <tr>
                                <th className="py-2">Päivä</th>
                                <th className="py-2 text-right">Näyttökerrat</th>
                                <th className="py-2 text-right">Klikkaukset</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-line">
                            {[...stats.daily].reverse().map((day) => (
                                <tr key={day.day}>
                                    <td className="py-2 text-ink">{day.label}</td>
                                    <td className="py-2 text-right text-ink">{formatCount(day.views)}</td>
                                    <td className="py-2 text-right text-ink">{formatCount(day.clicks)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </details>

            <p className="text-sm text-subtle">
                Näyttökerta tarkoittaa, että tarjous näkyi kävijälle, ja se lasketaan kerran sivulatausta kohden.
                Tilaukset ja komissiot lisätään, kun kumppanien raportit ovat käytettävissä.
            </p>
        </>
    )
}

function PartnerChip({ href, label, active }: { href: string; label: string; active: boolean }) {
    return (
        <Link
            href={href}
            aria-current={active ? 'true' : undefined}
            className={`flex-shrink-0 rounded-xl border px-4 py-2 text-xs font-bold transition-all ${active
                ? 'border-brand bg-brand text-white'
                : 'border-line bg-white text-ink hover:border-brand/40'
                }`}
        >
            {label}
        </Link>
    )
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
    return (
        <div className="bg-white p-6 rounded-[2rem] card-shadow border border-line">
            <div className="w-12 h-12 mb-4 rounded-2xl bg-soft text-brand flex items-center justify-center">
                {icon}
            </div>
            <p className="text-subtle text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
            <p className="text-3xl font-black text-ink tracking-tight">{value}</p>
        </div>
    )
}

function StatTable({ title, headers, rows, emptyText }: {
    title: string
    headers: string[]
    rows: { key: string; name: React.ReactNode; values: string[] }[]
    emptyText?: string
}) {
    return (
        <div className="bg-white rounded-[2rem] card-shadow border border-line overflow-hidden">
            <h3 className="p-6 md:p-8 text-xl font-bold text-ink border-b border-line">{title}</h3>
            {rows.length === 0 ? (
                <p className="p-6 md:p-8 text-sm text-subtle">{emptyText}</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-page text-subtle text-xs uppercase tracking-wider font-bold">
                            <tr>
                                {headers.map((header, i) => (
                                    <th key={header} className={`px-6 md:px-8 py-4 whitespace-nowrap ${i > 0 ? 'text-right' : ''}`}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-line">
                            {rows.map((row) => (
                                <tr key={row.key}>
                                    <td className="px-6 md:px-8 py-4">{row.name}</td>
                                    {row.values.map((value, i) => (
                                        <td key={i} className="px-6 md:px-8 py-4 text-right font-bold text-ink whitespace-nowrap">{value}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
