'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Star, Clock, Truck, MapPin } from 'lucide-react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { OfferWithDetails } from '@/lib/types/database'
import {
    formatPrice,
    getDiscountBadge,
    formatDeliveryTime,
    getMealImageUrl,
    getTrackingUrl
} from '@/lib/utils'

interface OfferCardProps {
    offer: OfferWithDetails
}

export default function OfferCard({ offer }: OfferCardProps) {
    const discountBadge = getDiscountBadge(offer.old_price_cents, offer.price_cents)
    const imageUrl = getMealImageUrl(offer.meal.image_path)
    const trackingUrl = getTrackingUrl(offer.id)

    return (
        <Card hover className="group">
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={offer.meal.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Discount Badge */}
                {discountBadge && (
                    <div className="absolute top-3 left-3">
                        <Badge variant="error" className="text-sm px-3 py-1">
                            {discountBadge}
                        </Badge>
                    </div>
                )}

                {/* Source Logo */}
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/90 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                    <span className="text-xs font-semibold text-gray-900 dark:text-white">
                        {offer.source.name}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                {/* Meal Name */}
                <h3 className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                    {offer.meal.name}
                </h3>

                {/* Restaurant & Location */}
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground line-clamp-1">
                        {offer.meal.restaurant.name}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{offer.meal.restaurant.city.name}</span>
                    </div>
                </div>

                {/* Rating */}
                {offer.meal.restaurant.rating > 0 && (
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-food-yellow text-food-yellow" />
                        <span className="text-sm font-medium">
                            {offer.meal.restaurant.rating.toFixed(1)}
                        </span>
                    </div>
                )}

                {/* Diet Flags */}
                {offer.meal.diet_flags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {offer.meal.diet_flags.slice(0, 3).map((flag) => (
                            <Badge
                                key={flag}
                                variant={flag as any}
                                className="text-xs"
                            >
                                {flag}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Delivery Info */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {offer.eta_minutes && (
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDeliveryTime(offer.eta_minutes)}</span>
                        </div>
                    )}
                    {!offer.is_pickup && (
                        <div className="flex items-center gap-1">
                            <Truck className="w-3 h-3" />
                            <span>
                                {offer.delivery_fee_cents === 0
                                    ? 'Free delivery'
                                    : formatPrice(offer.delivery_fee_cents)}
                            </span>
                        </div>
                    )}
                    {offer.is_pickup && (
                        <span className="text-accent font-medium">Pickup</span>
                    )}
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div>
                        {offer.old_price_cents && (
                            <p className="text-xs text-muted-foreground line-through">
                                {formatPrice(offer.old_price_cents)}
                            </p>
                        )}
                        <p className="text-2xl font-bold text-accent">
                            {formatPrice(offer.price_cents)}
                        </p>
                    </div>

                    <Link href={trackingUrl} target="_blank">
                        <Button variant="accent" size="md">
                            Go to Deal
                        </Button>
                    </Link>
                </div>
            </div>
        </Card>
    )
}
