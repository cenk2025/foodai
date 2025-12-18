'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Star, Clock, ShoppingBag } from 'lucide-react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import { OfferWithDetails } from '@/lib/types/database'
import {
    formatPrice,
    getDiscountBadge,
    formatDeliveryTime,
    getTrackingUrl,
    getSourceLogoUrl
} from '@/lib/utils'

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
    const discountBadge = getDiscountBadge(offer.old_price_cents, offer.price_cents)
    // Use demo images if Supabase image is just a path, otherwise use full URL
    const imageUrl = offer.meal.image_path?.startsWith('http')
        ? offer.meal.image_path
        : getDemoImage(offer.meal.name)

    const trackingUrl = getTrackingUrl(offer.id)

    return (
        <Card className="group border-none shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-zinc-900 overflow-hidden h-full flex flex-col">
            {/* Image Container - Taller aspect ratio for food appeal */}
            <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={offer.meal.name}
                    fill
                    priority={priority}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Discount Badge - Modern pill shape */}
                {discountBadge && (
                    <div className="absolute top-3 left-3 z-10">
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                            {discountBadge} OFF
                        </span>
                    </div>
                )}

                {/* Source Logo/Platform - Floating pill */}
                <div className="absolute bottom-3 right-3 z-10">
                    <div className="bg-white/95 dark:bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
                            {offer.source.name}
                        </span>
                    </div>
                </div>

                {/* Gradient Overlay for text readability if needed */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50 leading-tight line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {offer.meal.name}
                    </h3>
                    {offer.meal.restaurant.rating > 0 && (
                        <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-1.5 py-0.5 rounded flex-shrink-0">
                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-500">
                                {offer.meal.restaurant.rating.toFixed(1)}
                            </span>
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 line-clamp-1">
                        {offer.meal.restaurant.name}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500 mt-2">
                        <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{formatDeliveryTime(offer.eta_minutes)}</span>
                        </div>
                        <span>•</span>
                        <span>
                            {offer.delivery_fee_cents === 0
                                ? 'Free Delivery'
                                : `${formatPrice(offer.delivery_fee_cents)} delivery`}
                        </span>
                    </div>
                </div>

                {/* Price & Action - Always at bottom */}
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                    <div className="flex flex-col">
                        {offer.old_price_cents && (
                            <span className="text-xs text-gray-400 line-through font-medium">
                                {formatPrice(offer.old_price_cents)}
                            </span>
                        )}
                        <span className="text-xl font-extrabold text-gray-900 dark:text-white">
                            {formatPrice(offer.price_cents)}
                        </span>
                    </div>

                    <Link href={trackingUrl} target="_blank" className="w-auto">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4" />
                            Order
                        </button>
                    </Link>
                </div>
            </div>
        </Card>
    )
}
