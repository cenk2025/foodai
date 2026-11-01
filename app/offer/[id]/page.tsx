'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    ArrowLeft,
    Star,
    Clock,
    MapPin,
    ShoppingBag,
    ExternalLink,
    Share2,
    Heart,
    Utensils,
    TrendingDown,
    ChevronRight,
    Shield
} from 'lucide-react'
import { OfferWithDetails } from '@/lib/types/database'
import { getOfferById, getOffersForMeal } from '@/app/actions/offers'
import {
    formatPrice,
    getDiscountBadge,
    formatDeliveryTime,
    getSourceLabel,
    getTrackingUrl,
    isDemoSource
} from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/context'
import MealImage from '@/components/offers/MealImage'
import DemoNotice from '@/components/offers/DemoNotice'
import PriceComparison from '@/components/offers/PriceComparison'
import { getOfferTotal } from '@/lib/offers/compare'

export default function OfferDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { t } = useLanguage()
    const [offer, setOffer] = useState<OfferWithDetails | null>(null)
    const [mealOffers, setMealOffers] = useState<OfferWithDetails[]>([])
    const [loading, setLoading] = useState(true)
    const [isFavorite, setIsFavorite] = useState(false)

    useEffect(() => {
        const loadOffer = async () => {
            if (!params.id) return

            const data = await getOfferById(params.id as string)
            setOffer(data)
            setLoading(false)
            setMealOffers(data ? await getOffersForMeal(data.meal_id) : [])
        }

        loadOffer()
    }, [params.id])

    if (loading) {
        return (
            <div className="min-h-screen bg-page flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-brand/20 border-t-brand rounded-full animate-spin"></div>
            </div>
        )
    }

    if (!offer) {
        return (
            <div className="min-h-screen bg-page flex items-center justify-center p-6">
                <div className="bg-white p-12 rounded-[3rem] app-shadow text-center max-w-md border border-line">
                    <div className="w-20 h-20 bg-brand-soft rounded-[2rem] flex items-center justify-center text-brand mx-auto mb-8">
                        <Utensils className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-black text-ink mb-4">Tarjousta ei löytynyt</h2>
                    <p className="text-subtle font-medium mb-10">Pahoittelut, tätä herkullista tarjousta ei enää ole saatavilla.</p>
                    <Link href="/">
                        <button className="bg-brand text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-brand-dark transition-colors shadow-2xl active:scale-95">
                            Takaisin kotiin
                        </button>
                    </Link>
                </div>
            </div>
        )
    }

    const discountBadge = getDiscountBadge(offer.old_price_cents, offer.price_cents)
    const isDemo = isDemoSource(offer.source)
    const trackingUrl = getTrackingUrl(offer.id)

    return (
        <div className="min-h-screen bg-page font-outfit pb-24 md:pb-12">
            {/* Header / Back Navigation */}
            <div className="bg-brand pt-12 pb-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 blur-3xl rounded-full" />
                <div className="container mx-auto px-6 relative z-10 max-w-6xl">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Takaisin</span>
                    </button>
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="bg-white text-ink px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                            {offer.meal.restaurant.city.name}
                        </div>
                        <div className="text-white/90">•</div>
                        <div className="text-white font-black uppercase text-[10px] tracking-[0.2em]">
                            {offer.meal.restaurant.name}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 max-w-6xl -mt-20 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column: Media & Quick Info */}
                    <div className="space-y-8">
                        <div className="bg-white p-4 rounded-[3.5rem] app-shadow border border-line">
                            <div className="relative aspect-square w-full overflow-hidden rounded-[2.5rem] group">
                                <MealImage
                                    meal={offer.meal}
                                    priority
                                    className="transition-transform duration-1000 group-hover:scale-110"
                                    emojiClassName="text-9xl"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                                {discountBadge && (
                                    <div className="absolute bottom-6 left-6 md:bottom-auto md:top-6 z-10 anim-float">
                                        <div className="bg-save text-white text-lg font-black px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border-2 border-white/20">
                                            <TrendingDown className="w-4 h-4" />
                                            {discountBadge} {t.card.off}
                                        </div>
                                    </div>
                                )}
                                <div className="absolute top-6 right-6 z-10 flex gap-2">
                                    <button
                                        onClick={() => setIsFavorite(!isFavorite)}
                                        className={`w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all ${isFavorite ? 'text-brand bg-white' : 'text-white hover:bg-white hover:text-brand'}`}
                                    >
                                        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                                    </button>
                                    <button className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-ink transition-all">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Restaurant Details Card */}
                        <div className="bg-white rounded-[3rem] p-10 app-shadow border border-line group cursor-pointer hover:bg-soft/50 transition-colors">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-ink tracking-tight">{offer.meal.restaurant.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-subtle font-medium">
                                        <MapPin className="w-4 h-4 text-brand" />
                                        <span>{offer.meal.restaurant.city.name}</span>
                                    </div>
                                </div>
                                {offer.meal.restaurant.rating > 0 && (
                                    <div className="bg-soft border border-line px-5 py-3 rounded-2xl flex items-center gap-2 shadow-sm">
                                        <Star className="w-5 h-5 fill-star text-star" />
                                        <span className="text-lg font-black text-ink">
                                            {offer.meal.restaurant.rating.toFixed(1)}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="mt-8 pt-8 border-t border-line flex items-center justify-between group">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-subtle">Näytä ravintolan tiedot</span>
                                <ChevronRight className="w-5 h-5 text-subtle/60 group-hover:text-brand transition-all" />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Details & Primary Action */}
                    <div className="space-y-10 lg:pt-24">
                        <div className="space-y-6">
                            <h1 className="text-5xl md:text-6xl font-black text-ink leading-none tracking-tighter">
                                {offer.meal.name}
                            </h1>
                            {offer.meal.description && (
                                <p className="text-lg text-subtle font-medium leading-relaxed border-l-4 border-brand pl-6">
                                    {offer.meal.description}
                                </p>
                            )}

                            {/* Diet Flags */}
                            {offer.meal.diet_flags && offer.meal.diet_flags.length > 0 && (
                                <div className="flex flex-wrap gap-3">
                                    {offer.meal.diet_flags.map((flag) => (
                                        <span
                                            key={flag}
                                            className="px-6 py-2.5 bg-save/10 text-save text-[10px] font-black uppercase tracking-widest rounded-xl border border-save/10"
                                        >
                                            {t.filters.diet[flag as keyof typeof t.filters.diet] || flag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Delivery & Price Summary */}
                        <div className="grid grid-cols-2 gap-6 bg-white rounded-[3rem] p-10 app-shadow border border-line">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-subtle mb-1">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Toimitusaika</span>
                                </div>
                                <p className="text-2xl font-black text-ink">
                                    {formatDeliveryTime(offer.eta_minutes)}
                                </p>
                            </div>
                            <div className="space-y-1 text-right">
                                <div className="flex items-center justify-end gap-2 text-subtle mb-1">
                                    <ShoppingBag className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Kuljetus</span>
                                </div>
                                <p className="text-2xl font-black text-save">
                                    {offer.is_pickup
                                        ? t.card.pickup
                                        : offer.delivery_fee_cents === 0
                                            ? t.card.free_delivery
                                            : formatPrice(offer.delivery_fee_cents)}
                                </p>
                            </div>
                        </div>

                        {/* Same meal on other sources */}
                        <PriceComparison offers={mealOffers} currentOfferId={offer.id} />

                        {/* Main CTA Section */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-brand to-brand rounded-[3.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000" />
                            <div className="relative bg-ink rounded-[3rem] p-10 text-white overflow-hidden shadow-2xl">
                                <div className="absolute bottom-0 right-0 w-48 h-48 bg-brand/20 blur-3xl rounded-full" />

                                <div className="flex flex-wrap items-baseline justify-between gap-4 mb-10">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">Hinta nyt</p>
                                        <div className="flex flex-wrap items-baseline gap-x-4">
                                            <span className="text-5xl font-black text-white">
                                                {formatPrice(offer.price_cents)}
                                            </span>
                                            {offer.old_price_cents && (
                                                <span className="text-xl text-white/30 line-through font-bold">
                                                    {formatPrice(offer.old_price_cents)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">Alusta</p>
                                        <span className="text-xl font-black text-white px-4 py-1.5 rounded-xl border border-white/10 bg-white/5">
                                            {getSourceLabel(offer.source, t.card.example)}
                                        </span>
                                    </div>
                                </div>

                                <p className="-mt-6 mb-8 text-sm font-bold text-white/90">
                                    {t.card.total_with_delivery}: <span className="text-white">{formatPrice(getOfferTotal(offer))}</span>
                                </p>

                                {isDemo ? (
                                    <DemoNotice />
                                ) : (
                                    <>
                                        <Link href={trackingUrl} target="_blank" className="block">
                                            <button className="w-full bg-brand hover:bg-brand-dark text-white py-6 rounded-2xl font-black uppercase text-sm tracking-[0.2em] transition-all transform hover:scale-[1.02] active:scale-95 shadow-2xl flex items-center justify-center gap-4 group/btn">
                                                {t.card.order}
                                                <ExternalLink className="w-5 h-5" />
                                            </button>
                                        </Link>

                                        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30">
                                            <Shield className="w-4 h-4" />
                                            Turvallinen uudelleenohjaus palveluun {offer.source.name}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
