'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Clock, Star, TrendingDown } from 'lucide-react'
import { OfferWithDetails } from '@/lib/types/database'
import { calculateDiscount, formatPrice, getSourceLabel, getTrackingUrl, isDemoSource } from '@/lib/utils'
import { getOfferTotal } from '@/lib/offers/compare'
import { useLanguage } from '@/lib/i18n/context'
import MealImage from './MealImage'

const ROTATE_MS = 6000

interface FeaturedCarouselProps {
    // Real offers, best deal first. Callers remount (key) when the city changes.
    offers: OfferWithDetails[]
}

export default function FeaturedCarousel({ offers }: FeaturedCarouselProps) {
    const { t } = useLanguage()
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
    const isDemo = isDemoSource(offer.source)
    const go = (step: number) => setIndex((i) => (i + step + count) % count)

    return (
        <section
            className="relative"
            aria-roledescription="carousel"
            aria-label="Päivän parhaat alennukset"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
        >
            <div className="featured-card h-[440px] md:h-[400px] group shadow-2xl">
                <Link href={`/offer/${offer.id}`} className="absolute inset-0 z-0" aria-label={`${offer.meal.name}, ${offer.meal.restaurant.name}`}>
                    <MealImage
                        key={offer.id}
                        meal={offer.meal}
                        sizes="(max-width: 1280px) 100vw, 1248px"
                        priority={index === 0}
                        className="transition-transform duration-1000 group-hover:scale-110 animate-in fade-in duration-700"
                        emojiClassName="text-7xl md:text-9xl lg:text-[11rem] -translate-y-[120px] md:translate-x-40 md:translate-y-0 lg:translate-x-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-transparent" />
                </Link>

                {discount > 0 && (
                    <div className="absolute top-4 left-4 md:top-10 md:left-10 anim-float pointer-events-none">
                        <div className="bg-save text-white text-sm md:text-xl font-black px-3 py-2 md:px-6 md:py-3 rounded-2xl shadow-2xl flex items-center gap-2 md:gap-3 border-2 border-white/20">
                            <div className="bg-white/20 text-white p-1 rounded-lg">
                                <TrendingDown className="w-4 h-4 md:w-5 md:h-5" />
                            </div>
                            SÄÄSTÄ -{discount}%
                        </div>
                    </div>
                )}

                {count > 1 && (
                    <div className="absolute top-4 right-4 md:top-10 md:right-10 z-10 flex gap-2">
                        <button
                            onClick={() => go(-1)}
                            aria-label="Edellinen tarjous"
                            className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/15 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => go(1)}
                            aria-label="Seuraava tarjous"
                            className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/15 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

                <div className="absolute bottom-9 left-5 right-5 md:left-12 md:right-12 text-white pointer-events-none" aria-live="polite">
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3 md:mb-5">
                        <span className="hidden md:inline bg-brand text-white text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg border border-white/10">
                            Päivän tarjous
                        </span>
                        <span className="bg-white/10 backdrop-blur-xl px-3 md:px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider md:tracking-[0.2em] border border-white/10">
                            {getSourceLabel(offer.source, t.card.example)}
                        </span>
                        {offer.eta_minutes && (
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-3 md:px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider md:tracking-[0.2em] border border-white/10">
                                <Clock className="w-4 h-4 text-white" />
                                {offer.eta_minutes} min
                            </div>
                        )}
                        {offer.meal.restaurant.rating > 0 && (
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-3 md:px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider md:tracking-[0.2em] border border-white/10">
                                <Star className="w-4 h-4 text-star fill-star" />
                                {Number(offer.meal.restaurant.rating).toFixed(1)}
                            </div>
                        )}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black mb-2 md:mb-3 tracking-tighter leading-none line-clamp-2">{offer.meal.name}</h2>
                    <p className="text-white/80 font-medium md:text-lg mb-4 md:mb-6">
                        {offer.meal.restaurant.name}
                        {offer.meal.restaurant.city?.name ? ` · ${offer.meal.restaurant.city.name}` : ''}
                    </p>
                    <div className="flex flex-wrap items-center justify-between md:justify-start gap-3 md:gap-6">
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl md:text-4xl font-black text-white">{formatPrice(offer.price_cents)}</span>
                            {offer.old_price_cents && offer.old_price_cents > offer.price_cents && (
                                <span className="text-lg font-bold text-white/50 line-through">{formatPrice(offer.old_price_cents)}</span>
                            )}
                            {getOfferTotal(offer) !== offer.price_cents && (
                                <span className="text-sm font-bold text-white/70">{formatPrice(getOfferTotal(offer))} {t.card.total}</span>
                            )}
                        </div>
                        <a
                            href={isDemo ? `/offer/${offer.id}` : getTrackingUrl(offer.id)}
                            {...(isDemo ? {} : { target: '_blank', rel: 'noopener' })}
                            className="pointer-events-auto bg-white text-ink px-5 py-3 md:px-8 md:py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-line hover:scale-105 active:scale-95 transition-all shadow-xl"
                        >
                            {t.card.order}
                        </a>
                    </div>
                </div>

                {count > 1 && (
                    <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                        {offers.map((o, i) => (
                            <button
                                key={o.id}
                                onClick={() => setIndex(i)}
                                aria-label={`Tarjous ${i + 1}/${count}`}
                                aria-current={i === index % count}
                                className={`h-2 rounded-full transition-all ${i === index % count ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
