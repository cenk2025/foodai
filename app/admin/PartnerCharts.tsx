'use client'

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { CityRow, DayRow, PartnerRow } from '@/lib/admin/partner-stats'

const AXIS_TICK = { fill: '#6b625c', fontSize: 12 }
const TOOLTIP_STYLE = {
    backgroundColor: '#1f1a17',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
}
const TOOLTIP_ITEM = { color: 'white' }
const CURSOR = { fill: '#f5f3f1' }
const BAR_COLOR = '#d92d20'

function ChartCard({ title, summary, children }: { title: string; summary: string; children: React.ReactNode }) {
    return (
        <figure className="bg-white p-6 md:p-8 rounded-[2rem] card-shadow border border-line" aria-label={`${title}: ${summary}`}>
            <figcaption className="mb-6">
                <h3 className="text-xl font-bold text-ink">{title}</h3>
                <p className="text-sm text-subtle">{summary}</p>
            </figcaption>
            {children}
        </figure>
    )
}

function DailyChart({ title, unit, data, dataKey }: { title: string; unit: string; data: DayRow[]; dataKey: 'clicks' | 'views' }) {
    const total = data.reduce((sum, day) => sum + day[dataKey], 0)
    return (
        <ChartCard title={title} summary={`${total.toLocaleString('fi-FI')} yhteensä`}>
            <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ left: -16, right: 4 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ece9e6" />
                        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={AXIS_TICK} minTickGap={24} dy={8} />
                        <YAxis axisLine={false} tickLine={false} tick={AXIS_TICK} allowDecimals={false} />
                        <Tooltip cursor={CURSOR} contentStyle={TOOLTIP_STYLE} itemStyle={TOOLTIP_ITEM} formatter={(value) => [String(value), unit]} />
                        <Bar dataKey={dataKey} fill={BAR_COLOR} radius={[4, 4, 0, 0]} maxBarSize={28} isAnimationActive={false} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </ChartCard>
    )
}

function RankedChart({ title, summary, data }: { title: string; summary: string; data: { name: string; clicks: number }[] }) {
    return (
        <ChartCard title={title} summary={summary}>
            <div className="w-full" style={{ height: Math.max(120, data.length * 44 + 32) }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ece9e6" />
                        <XAxis type="number" axisLine={false} tickLine={false} tick={AXIS_TICK} allowDecimals={false} />
                        <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={AXIS_TICK} width={96} />
                        <Tooltip cursor={CURSOR} contentStyle={TOOLTIP_STYLE} itemStyle={TOOLTIP_ITEM} formatter={(value) => [String(value), 'Klikkaukset']} />
                        <Bar dataKey="clicks" fill={BAR_COLOR} radius={[0, 4, 4, 0]} maxBarSize={24} isAnimationActive={false} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </ChartCard>
    )
}

export default function PartnerCharts({ daily, partners, cities, showPartners }: {
    daily: DayRow[]
    partners: PartnerRow[]
    cities: CityRow[]
    showPartners: boolean
}) {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <DailyChart title="Klikkaukset päivittäin" unit="Klikkaukset" data={daily} dataKey="clicks" />
                <DailyChart title="Näyttökerrat päivittäin" unit="Näyttökerrat" data={daily} dataKey="views" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {showPartners && (
                    <RankedChart title="Klikkaukset kumppaneittain" summary="Eniten klikkauksia saaneet ensin" data={partners} />
                )}
                {cities.length > 0 && (
                    <RankedChart title="Klikkaukset kaupungeittain" summary="Eniten klikkauksia saaneet ensin" data={cities} />
                )}
            </div>
        </div>
    )
}
