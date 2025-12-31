'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Star, Clock, MapPin, ShoppingBag, Share2, Heart } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card, { CardHeader, CardContent } from '@/components/ui/Card'
import { OfferWithDetails } from '@/lib/types/database'
import { getOfferById } from '@/app/actions/offers'
import {
    formatPrice,
    getDiscountBadge,
    formatDeliveryTime,
    getTrackingUrl
} from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/context'

// Demo image mapping helper
function getDemoImage(mealName: string): string {
    const lower = mealName.toLowerCase()
    if (lower.includes('pizza')) return '/images/pizza.jpg'
    if (lower.includes('sushi') || lower.includes('maki') || lower.includes('roll')) return '/images/sushi.jpg'
    if (lower.includes('burger')) return '/images/burger.jpg'
    return '/images/placeholder-meal.jpg'
}

export default function OfferDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { t } = useLanguage()
    const [offer, setOffer] = useState<OfferWithDetails | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadOffer = async () => {
            if (!params.id) return

            const data = await getOfferById(params.id as string)
            setOffer(data)
            setLoading(false)
        }

        loadOffer()
    }, [params.id])

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!offer) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Tarjousta ei löytynyt</h2>
                    <Link href="/">
                        <Button>Takaisin kotiin</Button>
                    </Link>
                </div>
            </div>
        )
    }

    const discountBadge = getDiscountBadge(offer.old_price_cents, offer.price_cents)
    const imageUrl = offer.meal.image_path?.startsWith('http')
        ? offer.meal.image_path
        : getDemoImage(offer.meal.name)
    const trackingUrl = getTrackingUrl(offer.id)

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Back Button */}
                <Link href="/">
                    <Button variant="ghost" className="mb-6">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t.common.back_to_home}
                    </Button>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Image Section */}
                    <div className="space-y-4">
                        <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
                            <Image
                                src={imageUrl}
                                alt={offer.meal.name}
                                fill
                                priority
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                            {discountBadge && (
                                <div className="absolute top-4 left-4 z-10">
                                    <span className="bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                                        {discountBadge} {t.card.off}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Restaurant Info Card */}
                        <Card glass>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">{offer.meal.restaurant.name}</h3>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MapPin className="w-4 h-4" />
                                            <span>{offer.meal.restaurant.city.name}</span>
                                        </div>
                                    </div>
                                    {offer.meal.restaurant.rating > 0 && (
                                        <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1.5 rounded-lg">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-500">
                                                {offer.meal.restaurant.rating.toFixed(1)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                        </Card>
                    </div>

                    {/* Details Section */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-4xl font-bold mb-4">{offer.meal.name}</h1>
                            {offer.meal.description && (
                                <p className="text-lg text-muted-foreground mb-4">
                                    {offer.meal.description}
                                </p>
                            )}

                            {/* Diet Flags */}
                            {offer.meal.diet_flags && offer.meal.diet_flags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {offer.meal.diet_flags.map((flag) => (
                                        <span
                                            key={flag}
                                            className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-medium rounded-full"
                                        >
                                            {t.filters.diet[flag as keyof typeof t.filters.diet] || flag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Delivery Info */}
                        <Card glass>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-sm">Toimitusaika</span>
                                        </div>
                                        <p className="text-lg font-semibold">
                                            {formatDeliveryTime(offer.eta_minutes)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Toimitusmaksu</p>
                                        <p className="text-lg font-semibold">
                                            {offer.delivery_fee_cents === 0
                                                ? t.card.free_delivery
                                                : formatPrice(offer.delivery_fee_cents)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Price & Order */}
                        <Card className="border-2 border-primary/20 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-950/20 dark:to-teal-950/20">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Hinta</p>
                                        <div className="flex items-baseline gap-3">
                                            {offer.old_price_cents && (
                                                <span className="text-lg text-gray-400 line-through font-medium">
                                                    {formatPrice(offer.old_price_cents)}
                                                </span>
                                            )}
                                            <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
                                                {formatPrice(offer.price_cents)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground mb-1">Alusta</p>
                                        <span className="text-lg font-bold text-primary">
                                            {offer.source.name}
                                        </span>
                                    </div>
                                </div>

                                <Link href={trackingUrl} target="_blank" className="block">
                                    <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-teal-500 hover:to-blue-600 text-white shadow-lg">
                                        <ShoppingBag className="w-5 h-5 mr-2" />
                                        {t.card.order}
                                    </Button>
                                </Link>

                                <p className="text-xs text-center text-muted-foreground mt-3">
                                    Sinut ohjataan {offer.source.name} -palveluun tilauksen viimeistelyä varten
                                </p>
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1">
                                <Heart className="w-4 h-4 mr-2" />
                                Tallenna
                            </Button>
                            <Button variant="outline" className="flex-1">
                                <Share2 className="w-4 h-4 mr-2" />
                                Jaa
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
