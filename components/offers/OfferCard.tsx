'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { OfferWithDetails } from '@/lib/types/database'
import {
    formatPrice,
    getDiscountBadge,
    formatDeliveryTime,
} from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/context'

interface OfferCardProps {
    offer: OfferWithDetails
    priority?: boolean
    onMouseEnter?: () => void
    onMouseLeave?: () => void
}

// Demo image mapping helper
function getDemoImage(mealName: string): string {
    const lower = mealName.toLowerCase()
    if (lower.includes('pizza')) return '/images/pizza.jpg'
    if (lower.includes('sushi') || lower.includes('maki') || lower.includes('roll')) return '/images/sushi.jpg'
    if (lower.includes('burger')) return '/images/burger.jpg'
    return '/images/placeholder-meal.jpg'
}

export default function OfferCard({ offer, priority = false, onMouseEnter, onMouseLeave }: OfferCardProps) {
    const { t } = useLanguage()
    const discountBadge = getDiscountBadge(offer.old_price_cents, offer.price_cents)

    // Use demo images if Supabase image is just a path, otherwise use full URL
    const imageUrl = offer.meal.image_path?.startsWith('http')
        ? offer.meal.image_path
        : getDemoImage(offer.meal.name)

    return (
        <Link
            href={`/offer/${offer.id}`}
        >
            <div
                className="group bg-white rounded-[2rem] overflow-hidden app-shadow hover:shadow-2xl transition-all duration-300 flex flex-col h-full cursor-pointer border border-[#f1ebd8]/50"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                {/* Image Container */}
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={offer.meal.name}
                        fill
                        priority={priority}
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
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
                        <span className="bg-white/90 backdrop-blur-sm text-[#3d1d11] text-[9px] font-bold px-2 py-1 rounded-lg uppercase tracking-tighter shadow-sm border border-black/5">
                            {offer.source.name}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-base font-bold text-[#3d1d11] leading-tight mb-2 line-clamp-1 group-hover:text-[#d35400] transition-colors">
                        {offer.meal.name}
                    </h3>

                    {/* Meta Info */}
                    <div className="flex items-center gap-1.5 text-[11px] text-[#a08a7e] mb-4 font-medium">
                        <span>{formatDeliveryTime(offer.eta_minutes)}</span>
                        <span>•</span>
                        <span>
                            {offer.delivery_fee_cents === 0
                                ? t.card.free_delivery
                                : `Kuljetus ${formatPrice(offer.delivery_fee_cents)}`}
                        </span>
                    </div>

                    {/* Price & Savings */}
                    <div className="mt-auto space-y-3">
                        <div className="flex items-baseline gap-2">
                            <span className="text-xl font-black text-[#e67e22]">
                                {formatPrice(offer.price_cents)}
                            </span>
                            {offer.old_price_cents && (
                                <span className="text-xs text-[#a08a7e] line-through decoration-[#a08a7e]/50">
                                    {formatPrice(offer.old_price_cents)}
                                </span>
                            )}
                        </div>

                        {discountBadge && (
                            <div className="inline-block">
                                <span className="price-badge">
                                    {t.preview.savings} {discountBadge}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}
