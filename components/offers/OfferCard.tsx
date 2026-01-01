'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Star, Clock, ShoppingBag } from 'lucide-react'
import Card from '../ui/Card'
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
}

// Demo image mapping helper
function getDemoImage(mealName: string): string {
    const lower = mealName.toLowerCase()
    if (lower.includes('pizza')) return '/images/pizza.jpg'
    if (lower.includes('sushi') || lower.includes('maki') || lower.includes('roll')) return '/images/sushi.jpg'
    if (lower.includes('burger')) return '/images/burger.jpg'
    return '/images/placeholder-meal.jpg'
}

export default function OfferCard({ offer, priority = false }: OfferCardProps) {
    const { t } = useLanguage()
    const discountBadge = getDiscountBadge(offer.old_price_cents, offer.price_cents)

    // Use demo images if Supabase image is just a path, otherwise use full URL
    const imageUrl = offer.meal.image_path?.startsWith('http')
        ? offer.meal.image_path
        : getDemoImage(offer.meal.name)

    return (
        <Link href={`/offer/${offer.id}`}>
            <Card className="group border-none food-card-shadow hover:food-card-shadow-hover hover-lift bg-white dark:bg-zinc-900 overflow-hidden h-full flex flex-col cursor-pointer">
                {/* Circular Image Container - Like the example */}
                <div className="relative w-full p-6 pb-0">
                    <div className="relative w-full aspect-square circle-image mx-auto">
                        <Image
                            src={imageUrl}
                            alt={offer.meal.name}
                            fill
                            priority={priority}
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />

                        {/* Discount Badge - Top Right */}
                        {discountBadge && (
                            <div className="absolute -top-2 -right-2 z-10">
                                <span className="bg-food-red text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                    {discountBadge} {t.card.off}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                    {/* Restaurant Name - Small, above title */}
                    <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">
                        {offer.meal.restaurant.name}
                    </p>

                    {/* Meal Name */}
                    <h3 className="text-lg font-bold text-foreground leading-tight mb-3 line-clamp-2 group-hover:text-food-orange transition-colors">
                        {offer.meal.name}
                    </h3>

                    {/* Meta Info */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                        {offer.meal.restaurant.rating > 0 && (
                            <>
                                <div className="flex items-center gap-1">
                                    <Star className="w-3.5 h-3.5 fill-food-yellow text-food-yellow" />
                                    <span className="font-semibold text-foreground">
                                        {offer.meal.restaurant.rating.toFixed(1)}
                                    </span>
                                </div>
                                <span>•</span>
                            </>
                        )}
                        <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{formatDeliveryTime(offer.eta_minutes)}</span>
                        </div>
                    </div>

                    {/* Price & Platform - Always at bottom */}
                    <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                        <div className="flex flex-col">
                            {offer.old_price_cents && (
                                <span className="text-xs text-muted-foreground line-through font-medium">
                                    {formatPrice(offer.old_price_cents)}
                                </span>
                            )}
                            <span className="text-2xl font-extrabold text-foreground">
                                {formatPrice(offer.price_cents)}
                            </span>
                        </div>

                        {/* Order Button */}
                        <div className="flex flex-col items-end gap-1">
                            <div
                                className="text-white rounded-full px-4 py-2 text-xs font-semibold transition-all shadow-md group-hover:shadow-lg flex items-center gap-1.5 cursor-pointer"
                                style={{
                                    background: 'linear-gradient(to right, #ff6b35, #ff4757)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'linear-gradient(to right, #ff4757, #ff6b35)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'linear-gradient(to right, #ff6b35, #ff4757)'
                                }}
                            >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>{t.card.order}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    )
}
