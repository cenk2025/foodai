'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
    ArrowLeft,
    Star,
    Clock,
    MapPin,
    ShoppingBag,
    Share2,
    Heart,
    Utensils,
    TrendingDown,
    ChevronRight,
    Shield
} from 'lucide-react'
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
    const [isFavorite, setIsFavorite] = useState(false)

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
            <div className="min-h-screen bg-[#fffcf8] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#d35400]/20 border-t-[#d35400] rounded-full animate-spin"></div>
            </div>
        )
    }

    if (!offer) {
        return (
            <div className="min-h-screen bg-[#fffcf8] flex items-center justify-center p-6">
                <div className="bg-white p-12 rounded-[3rem] app-shadow text-center max-w-md border border-[#f1ebd8]">
                    <div className="w-20 h-20 bg-[#fff0f0] rounded-[2rem] flex items-center justify-center text-[#e74c3c] mx-auto mb-8">
                        <Utensils className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-black text-[#3d1d11] mb-4">Tarjousta ei löytynyt</h2>
                    <p className="text-[#a08a7e] font-medium mb-10">Pahoittelut, tätä herkullista tarjousta ei enää ole saatavilla.</p>
                    <Link href="/">
                        <button className="bg-[#3d1d11] text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-[#d35400] transition-colors shadow-2xl active:scale-95">
                            Takaisin kotiin
                        </button>
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
        <div className="min-h-screen bg-[#fffcf8] font-outfit pb-24 md:pb-12">
            {/* Header / Back Navigation */}
            <div className="bg-[#3d1d11] pt-12 pb-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#d35400]/10 blur-3xl rounded-full" />
                <div className="container mx-auto px-6 relative z-10 max-w-6xl">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Takaisin</span>
                    </button>
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="bg-[#f3d179] text-[#3d1d11] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                            {offer.meal.restaurant.city.name}
                        </div>
                        <div className="text-white/40">•</div>
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
                        <div className="bg-white p-4 rounded-[3.5rem] app-shadow border border-[#f1ebd8]">
                            <div className="relative aspect-square w-full overflow-hidden rounded-[2.5rem] group">
                                <Image
                                    src={imageUrl}
                                    alt={offer.meal.name}
                                    fill
                                    priority
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                                {discountBadge && (
                                    <div className="absolute top-6 left-6 z-10 anim-float">
                                        <div className="bg-[#d35400] text-white text-lg font-black px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border-2 border-white/20">
                                            <TrendingDown className="w-4 h-4" />
                                            {discountBadge} {t.card.off}
                                        </div>
                                    </div>
                                )}
                                <div className="absolute top-6 right-6 z-10 flex gap-2">
                                    <button
                                        onClick={() => setIsFavorite(!isFavorite)}
                                        className={`w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all ${isFavorite ? 'text-[#e74c3c] bg-white' : 'text-white hover:bg-white hover:text-[#e74c3c]'}`}
                                    >
                                        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                                    </button>
                                    <button className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-[#3d1d11] transition-all">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Restaurant Details Card */}
                        <div className="bg-white rounded-[3rem] p-10 app-shadow border border-[#f1ebd8] group cursor-pointer hover:bg-[#fff9f0]/50 transition-colors">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-[#3d1d11] tracking-tight">{offer.meal.restaurant.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-[#a08a7e] font-medium">
                                        <MapPin className="w-4 h-4 text-[#d35400]" />
                                        <span>{offer.meal.restaurant.city.name}</span>
                                    </div>
                                </div>
                                {offer.meal.restaurant.rating > 0 && (
                                    <div className="bg-[#fff9f0] border border-[#f3d179]/30 px-5 py-3 rounded-2xl flex items-center gap-2 shadow-sm">
                                        <Star className="w-5 h-5 fill-[#f39c12] text-[#f39c12]" />
                                        <span className="text-lg font-black text-[#3d1d11]">
                                            {offer.meal.restaurant.rating.toFixed(1)}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="mt-8 pt-8 border-t border-[#f1ebd8] flex items-center justify-between group">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#a08a7e]">Näytä ravintolan tiedot</span>
                                <ChevronRight className="w-5 h-5 text-[#f1ebd8] group-hover:text-[#d35400] transition-all" />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Details & Primary Action */}
                    <div className="space-y-10">
                        <div className="space-y-6">
                            <h1 className="text-5xl md:text-6xl font-black text-[#3d1d11] leading-none tracking-tighter">
                                {offer.meal.name}
                            </h1>
                            {offer.meal.description && (
                                <p className="text-lg text-[#a08a7e] font-medium leading-relaxed border-l-4 border-[#f3d179] pl-6">
                                    {offer.meal.description}
                                </p>
                            )}

                            {/* Diet Flags */}
                            {offer.meal.diet_flags && offer.meal.diet_flags.length > 0 && (
                                <div className="flex flex-wrap gap-3">
                                    {offer.meal.diet_flags.map((flag) => (
                                        <span
                                            key={flag}
                                            className="px-6 py-2.5 bg-[#27ae60]/10 text-[#27ae60] text-[10px] font-black uppercase tracking-widest rounded-xl border border-[#27ae60]/10"
                                        >
                                            {t.filters.diet[flag as keyof typeof t.filters.diet] || flag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Delivery & Price Summary */}
                        <div className="grid grid-cols-2 gap-6 bg-white rounded-[3rem] p-10 app-shadow border border-[#f1ebd8]">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-[#a08a7e] mb-1">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Toimitusaika</span>
                                </div>
                                <p className="text-2xl font-black text-[#3d1d11]">
                                    {formatDeliveryTime(offer.eta_minutes)}
                                </p>
                            </div>
                            <div className="space-y-1 text-right">
                                <div className="flex items-center justify-end gap-2 text-[#a08a7e] mb-1">
                                    <ShoppingBag className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Kuljetus</span>
                                </div>
                                <p className="text-2xl font-black text-[#27ae60]">
                                    {offer.delivery_fee_cents === 0
                                        ? 'ILMAINEN'
                                        : formatPrice(offer.delivery_fee_cents)}
                                </p>
                            </div>
                        </div>

                        {/* Main CTA Section */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#f3d179] to-[#d35400] rounded-[3.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000" />
                            <div className="relative bg-[#3d1d11] rounded-[3rem] p-10 text-white overflow-hidden shadow-2xl">
                                <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#d35400]/20 blur-3xl rounded-full" />

                                <div className="flex items-baseline justify-between mb-10">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Hinta nyt</p>
                                        <div className="flex items-baseline gap-4">
                                            <span className="text-5xl font-black text-[#f3d179]">
                                                {formatPrice(offer.price_cents)}
                                            </span>
                                            {offer.old_price_cents && (
                                                <span className="text-xl text-white/30 line-through font-bold">
                                                    {formatPrice(offer.old_price_cents)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Alusta</p>
                                        <span className="text-xl font-black text-white px-4 py-1.5 rounded-xl border border-white/10 bg-white/5">
                                            {offer.source.name}
                                        </span>
                                    </div>
                                </div>

                                <Link href={trackingUrl} target="_blank" className="block">
                                    <button className="w-full bg-[#f3d179] hover:bg-white text-[#3d1d11] py-6 rounded-2xl font-black uppercase text-sm tracking-[0.2em] transition-all transform hover:scale-[1.02] active:scale-95 shadow-2xl flex items-center justify-center gap-4 group/btn">
                                        <ShoppingBag className="w-5 h-5" />
                                        Siirry tilaamaan
                                        <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </Link>

                                <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30">
                                    <Shield className="w-4 h-4" />
                                    Turvallinen uudelleenohjaus palveluun {offer.source.name}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
