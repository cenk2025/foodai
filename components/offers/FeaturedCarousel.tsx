'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Clock, Star, TrendingDown } from 'lucide-react'
import { OfferWithDetails } from '@/lib/types/database'
import { calculateDiscount, formatPrice, getMealImage, getTrackingUrl } from '@/lib/utils'

const ROTATE_MS = 6000

interface FeaturedCarouselProps {
    // Real offers, best deal first. Callers remount (key) when the city changes.
    offers: OfferWithDetails[]
    onHover?: (offer: OfferWithDetails | null) => void
}

export default function FeaturedCarousel({ offers, onHover }: FeaturedCarouselProps) {
    const [index, setIndex] = useState(0)
    const [paused, setPaused] = useState(false)
    const count = offers.length

    useEffect(() => {
        if (paused || count < 2) return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const timer = setInterval(() => setIndex((i) => (i + 1) % count), ROTATE_MS)
        return () => clearInterval(timer)
    }, [paused, count])

    if (count === 0) return null
    const offer = offers[index % count]
    const discount = calculateDiscount(offer.old_price_cents ?? 0, offer.price_cents)
    const go = (step: number) => setIndex((i) => (i + step + count) % count)

    return (
        <section
            className="relative"
            aria-roledescription="carousel"
            aria-label="Päivän parhaat alennukset"
            onMouseEnter={() => { setPaused(true); onHover?.(offer) }}
            onMouseLeave={() => { setPaused(false); onHover?.(null) }}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
        >
            <div className="featured-card h-[400px] md:h-[500px] group shadow-2xl">
                <Link href={`/offer/${offer.id}`} className="absolute inset-0 z-0" aria-label={`${offer.meal.name}, ${offer.meal.restaurant.name}`}>
                    <Image
                        key={offer.id}
                        src={getMealImage(offer.meal.name, offer.meal.image_path)}
                        alt={offer.meal.name}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110 animate-in fade-in duration-700"
                        priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#3d1d11] via-[#3d1d11]/40 to-transparent" />
                </Link>

                {discount > 0 && (
                    <div className="absolute top-10 left-10 anim-float pointer-events-none">
                        <div className="bg-[#f3d179] text-[#3d1d11] text-lg md:text-xl font-black px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-white/20">
                            <div className="bg-[#3d1d11] text-white p-1 rounded-lg">
                                <TrendingDown className="w-5 h-5" />
                            </div>
                            SÄÄSTÄ -{discount}%
                        </div>
                    </div>
                )}

                {count > 1 && (
                    <div className="absolute top-10 right-10 z-10 flex gap-2">
                        <button
                            onClick={() => go(-1)}
                            aria-label="Edellinen tarjous"
                            className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => go(1)}
                            aria-label="Seuraava tarjous"
                            className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

                <div className="absolute bottom-10 left-8 right-8 md:left-12 md:right-12 text-white pointer-events-none" aria-live="polite">
                    <div className="flex flex-wrap items-center gap-3 mb-5">
                        <span className="bg-[#d35400] text-white text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg border border-white/10">
                            Päivän tarjous
                        </span>
                        <span className="bg-white/10 backdrop-blur-xl px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] border border-white/10">
                            {offer.source.name}
                        </span>
                        {offer.eta_minutes && (
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] border border-white/10">
                                <Clock className="w-4 h-4 text-[#f3d179]" />
                                {offer.eta_minutes} min
                            </div>
                        )}
                        {offer.meal.restaurant.rating > 0 && (
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] border border-white/10">
                                <Star className="w-4 h-4 text-[#f3d179] fill-[#f3d179]" />
                                {Number(offer.meal.restaurant.rating).toFixed(1)}
                            </div>
                        )}
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black mb-3 tracking-tighter leading-none">{offer.meal.name}</h2>
                    <p className="text-[#fdf2e2]/80 font-medium text-lg mb-6">
                        {offer.meal.restaurant.name}
                        {offer.meal.restaurant.city?.name ? ` · ${offer.meal.restaurant.city.name}` : ''}
                    </p>
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-black text-[#f3d179]">{formatPrice(offer.price_cents)}</span>
                            {offer.old_price_cents && offer.old_price_cents > offer.price_cents && (
                                <span className="text-lg font-bold text-white/50 line-through">{formatPrice(offer.old_price_cents)}</span>
                            )}
                        </div>
                        <a
                            href={getTrackingUrl(offer.id)}
                            target="_blank"
                            rel="noopener"
                            className="pointer-events-auto bg-white text-[#3d1d11] px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-[#f3d179] hover:scale-105 active:scale-95 transition-all shadow-xl"
                        >
                            Katso tarjous
                        </a>
                    </div>
                </div>

                {count > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                        {offers.map((o, i) => (
                            <button
                                key={o.id}
                                onClick={() => setIndex(i)}
                                aria-label={`Tarjous ${i + 1}/${count}`}
                                aria-current={i === index % count}
                                className={`h-2 rounded-full transition-all ${i === index % count ? 'w-8 bg-[#f3d179]' : 'w-2 bg-white/40 hover:bg-white/70'}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
