'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Star } from 'lucide-react'
import { OfferWithDetails } from '@/lib/types/database'
import {
    formatPrice,
    getDiscountBadge,
    formatDeliveryTime,
    getSourceLabel,
    getTrackingUrl,
    isDemoSource,
} from '@/lib/utils'
import { getOfferTotal } from '@/lib/offers/compare'
import { useLanguage } from '@/lib/i18n/context'
import MealImage from './MealImage'

interface OfferCardProps {
    offer: OfferWithDetails
    // Other sources selling the same meal, cheapest first
    others?: OfferWithDetails[]
    priority?: boolean
}

export default function OfferCard({ offer, others = [], priority = false }: OfferCardProps) {
    const { t } = useLanguage()
    const router = useRouter()
    const discountBadge = getDiscountBadge(offer.old_price_cents, offer.price_cents)

    const isDemo = isDemoSource(offer.source)

    // "View Deal" goes through /go, which records the click and forwards to the partner
    const handleViewDeal = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (isDemo) {
            router.push(`/offer/${offer.id}`)
            return
        }
        window.open(getTrackingUrl(offer.id), '_blank', 'noopener')
    }

    return (
        <div
            className="group bg-white rounded-[2rem] overflow-hidden app-shadow hover:shadow-2xl transition-all duration-300 flex flex-col h-full cursor-pointer border border-[#f1ebd8]/50 relative"
        >
            <Link href={`/offer/${offer.id}`} className="absolute inset-0 z-0" />

            {/* Image Container */}
            <div className="relative w-full aspect-[4/3] overflow-hidden">
                <MealImage
                    meal={offer.meal}
                    priority={priority}
                    className="transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Rating Badge */}
                {offer.meal.restaurant.rating > 0 && (
                    <div className="rating-badge m-2">
                        <Star className="w-3 h-3 fill-[#f39c12] text-[#f39c12]" />
                        <span>{offer.meal.restaurant.rating.toFixed(1)}</span>
                    </div>
                )}

                {/* Popular/Source Badge */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {offer.meal.restaurant.rating > 4.5 && (
                        <span className="bg-[#e74c3c] text-white text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-wider">
                            SUOSITTU
                        </span>
                    )}
                    <span className="bg-white/90 backdrop-blur-sm text-[#3d1d11] text-[9px] font-bold px-2 py-1 rounded-lg uppercase tracking-wide shadow-sm border border-black/5">
                        {getSourceLabel(offer.source, t.card.example)}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow relative z-10 pointer-events-none">
                <h3 className="text-base font-bold text-[#3d1d11] leading-tight line-clamp-1 group-hover:text-[#d35400] transition-colors">
                    {offer.meal.name}
                </h3>
                <p className="text-xs text-[#a08a7e] font-medium mb-4 line-clamp-1">{offer.meal.restaurant.name}</p>

                {/* Total price: what the customer actually pays */}
                <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-2xl font-black text-[#e67e22]">{formatPrice(getOfferTotal(offer))}</span>
                    <span className="text-[11px] font-bold text-[#a08a7e]">{t.card.total}</span>
                    {others.length > 0 && (
                        <span className="rounded-lg bg-[#27ae60]/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#27ae60]">
                            {t.card.lowest}
                        </span>
                    )}
                </div>

                {/* How the total is made up */}
                <p className="mt-1 text-[11px] text-[#a08a7e] font-medium">
                    {t.card.meal} {formatPrice(offer.price_cents)}
                    {offer.old_price_cents && offer.old_price_cents > offer.price_cents && (
                        <span className="ml-1 line-through decoration-[#a08a7e]/50">{formatPrice(offer.old_price_cents)}</span>
                    )}
                    {discountBadge && <span className="price-badge inline-block ml-1 px-1.5 py-0">{discountBadge}</span>}
                    {' · '}
                    {offer.is_pickup
                        ? t.card.pickup
                        : offer.delivery_fee_cents === 0
                            ? t.card.free_delivery
                            : `${t.card.delivery} ${formatPrice(offer.delivery_fee_cents)}`}
                    {' · '}
                    {formatDeliveryTime(offer.eta_minutes)}
                </p>

                {/* Same meal on other sources */}
                {others.length > 0 && (
                    <ul className="mt-3 space-y-1 border-t border-dashed border-[#f1ebd8] pt-3">
                        {others.slice(0, 2).map((other) => (
                            <li key={other.id} className="flex items-center justify-between gap-2 text-xs font-medium text-[#a08a7e]">
                                <span className="truncate">{getSourceLabel(other.source, t.card.example)}{other.is_pickup ? ` · ${t.card.pickup}` : ''}</span>
                                <span className="font-bold text-[#3d1d11]">{formatPrice(getOfferTotal(other))}</span>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="flex-grow min-h-4" />

                <button
                    onClick={handleViewDeal}
                    className="pointer-events-auto w-full bg-[#3d1d11] text-white px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-[#d35400] active:scale-95 transition-all shadow-lg"
                >
                    {t.card.order} &rarr;
                </button>
            </div>
        </div>
    )
}
