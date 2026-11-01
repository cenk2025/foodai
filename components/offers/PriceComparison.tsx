'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { OfferWithDetails } from '@/lib/types/database'
import { getOfferTotal, sortByTotal } from '@/lib/offers/compare'
import { formatDeliveryTime, formatPrice, getSourceLabel, getTrackingUrl, isDemoSource } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/context'

interface PriceComparisonProps {
    offers: OfferWithDetails[]
    currentOfferId: string
}

// Every source selling this meal, cheapest total first.
export default function PriceComparison({ offers, currentOfferId }: PriceComparisonProps) {
    const { t } = useLanguage()
    if (offers.length < 2) return null

    const ranked = sortByTotal(offers)

    return (
        <section className="bg-white rounded-[3rem] p-6 md:p-10 app-shadow border border-[#f1ebd8]">
            <h2 className="text-2xl font-black text-[#3d1d11] tracking-tight">{t.card.compare_title}</h2>
            <p className="text-sm text-[#a08a7e] font-medium mb-6">{t.card.compare_subtitle}</p>

            <ul className="space-y-3">
                {ranked.map((offer, i) => {
                    const isCurrent = offer.id === currentOfferId
                    const isDemo = isDemoSource(offer.source)
                    return (
                        <li key={offer.id}>
                            <Link
                                href={isDemo ? `/offer/${offer.id}` : getTrackingUrl(offer.id)}
                                {...(isDemo ? {} : { target: '_blank', rel: 'noopener' })}
                                aria-current={isCurrent ? 'true' : undefined}
                                className={`flex items-center justify-between gap-3 rounded-2xl border p-4 transition-colors hover:border-[#d35400]/40 ${isCurrent ? 'border-[#f3d179] bg-[#fff9f0]' : 'border-[#f1ebd8]'}`}
                            >
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-black text-[#3d1d11]">{getSourceLabel(offer.source, t.card.example)}</span>
                                        {i === 0 && (
                                            <span className="rounded-lg bg-[#27ae60]/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#27ae60]">
                                                {t.card.lowest}
                                            </span>
                                        )}
                                        {isCurrent && (
                                            <span className="rounded-lg bg-[#f3d179]/40 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#3d1d11]">
                                                {t.card.current}
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-1 text-xs font-medium text-[#a08a7e]">
                                        {t.card.meal} {formatPrice(offer.price_cents)}
                                        {' · '}
                                        {offer.is_pickup
                                            ? t.card.pickup
                                            : offer.delivery_fee_cents === 0
                                                ? t.card.free_delivery
                                                : `${t.card.delivery} ${formatPrice(offer.delivery_fee_cents)}`}
                                        {' · '}
                                        {formatDeliveryTime(offer.eta_minutes)}
                                    </p>
                                </div>
                                <div className="flex flex-shrink-0 items-center gap-2">
                                    <span className="text-lg font-black text-[#e67e22]">{formatPrice(getOfferTotal(offer))}</span>
                                    <ChevronRight className="h-4 w-4 text-[#a08a7e]" />
                                </div>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}
