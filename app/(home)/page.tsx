'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { searchOffers, getCities, SearchParams } from '@/app/actions/offers'
import SearchBar from '@/components/search/SearchBar'
import OfferCard from '@/components/offers/OfferCard'
import OfferShelf from '@/components/offers/OfferShelf'
import FulfilmentToggle, { type Fulfilment } from '@/components/offers/FulfilmentToggle'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { OfferWithDetails } from '@/lib/types/database'
import { Check, ChevronRight, Sparkles, X } from 'lucide-react'
import Footer from '@/components/layout/Footer'
import FeaturedCarousel from '@/components/offers/FeaturedCarousel'
import DemoNotice from '@/components/offers/DemoNotice'
import { useLocation } from '@/lib/context/LocationContext'
import HomepageDirectRestaurants from '@/components/direct-ordering/HomepageDirectRestaurants'
import { DIRECT_ORDERING_ENABLED } from '@/lib/features'
import { useLanguage } from '@/lib/i18n/context'
import { calculateDiscount, isDemoSource } from '@/lib/utils'
import { compareByMeal } from '@/lib/offers/compare'
import { describeIntent, looksLikeNaturalLanguage, type SearchIntent } from '@/lib/ai/search-intent'

const SHELF_SIZE = 8

// Meal names in the data are English, so chips search by the English word
const CATEGORIES: Array<{ label: string; params: Pick<SearchParams, 'query' | 'dietFlags'> }> = [
  { label: 'Kaikki', params: {} },
  { label: 'Pizza', params: { query: 'pizza' } },
  { label: 'Burgerit', params: { query: 'burger' } },
  { label: 'Kebab', params: { query: 'kebab' } },
  { label: 'Sushi', params: { query: 'sushi' } },
  { label: 'Pasta', params: { query: 'pasta' } },
  { label: 'Salaatit', params: { query: 'salad' } },
  { label: 'Vegaani', params: { dietFlags: ['vegan'] } },
]

export default function HomePage() {
  const { city } = useLocation()
  const { t } = useLanguage()
  const [cities, setCities] = useState<Array<{ id: string; name: string }>>([])
  const [offers, setOffers] = useState<OfferWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Kaikki')

  const [sortBy, setSortBy] = useState<'price_asc' | 'savings_desc'>('price_asc')
  const [freeDelivery, setFreeDelivery] = useState(false)
  const [fulfilment, setFulfilment] = useState<Fulfilment>('delivery')
  // Every offer in the selected city, for the hero carousel and shelves
  const [cityOffers, setCityOffers] = useState<OfferWithDetails[]>([])
  // Set while the grid shows results of a natural-language (AI) search
  const [aiLabels, setAiLabels] = useState<string[] | null>(null)

  // Load cities on mount
  useEffect(() => {
    getCities().then((data) => {
      setCities(data)
    })
  }, [])

  useEffect(() => {
    if (cities.length === 0) return
    const cityId = cities.find(c => c.name.toLowerCase() === city.toLowerCase())?.id
    let cancelled = false
    searchOffers({ cityId, sortBy: 'savings_desc' })
      .then((results) => { if (!cancelled) setCityOffers(results) })
      .catch(() => { if (!cancelled) setCityOffers([]) })
    return () => { cancelled = true }
  }, [cities, city])

  const handleSearch = useCallback(async (
    query: string,
    category: string = 'Kaikki',
    sort: 'price_asc' | 'savings_desc' = sortBy,
    isFreeDel: boolean = freeDelivery
  ) => {
    setLoading(true)
    setAiLabels(null)
    setSearchQuery(query)
    setSelectedCategory(category)

    // Map city name to ID if possible, otherwise use name (lowercase)
    const targetCityId = cities.find(c => c.name.toLowerCase() === city.toLowerCase())?.id || city.toLowerCase()
    const categoryParams = CATEGORIES.find(c => c.label === category)?.params ?? {}

    const params: SearchParams = {
      query: query || categoryParams.query,
      dietFlags: categoryParams.dietFlags,
      cityId: targetCityId,
      sortBy: sort,
      freeDelivery: isFreeDel
    }

    try {
      setOffers((await searchOffers(params)) ?? [])
    } catch (error) {
      console.error('Search error:', error)
      setOffers([])
    } finally {
      setLoading(false)
    }
  }, [cities, city, sortBy, freeDelivery])

  // Sentences ("vegaani alle 10 € ilmainen toimitus") are interpreted by the AI;
  // if it is unavailable we fall back to the plain keyword search.
  const handleAiSearch = async (text: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, city }),
      })
      if (!res.ok) throw new Error(`AI search failed: ${res.status}`)
      const data = (await res.json()) as { intent: SearchIntent; city: string | null; offers: OfferWithDetails[] }
      setOffers(data.offers)
      setAiLabels(describeIntent(data.intent, data.city, t.ai))
      if (data.intent.pickupOnly) setFulfilment('pickup')
      else if (data.intent.deliveryOnly || data.intent.freeDelivery) setFulfilment('delivery')
      setLoading(false)
    } catch (error) {
      console.error(error)
      handleSearch(text, selectedCategory, sortBy, freeDelivery)
    }
  }

  const clearAiSearch = () => handleSearch(searchQuery, selectedCategory, sortBy, freeDelivery)

  const chooseFulfilment = (value: Fulfilment) => {
    setFulfilment(value)
    // Free delivery means nothing for pickup, and would hide most of its offers
    if (value === 'pickup') setFreeDelivery(false)
  }

  // One card per meal, so the same dish on three sources reads as a comparison
  const comparisons = useMemo(
    () => compareByMeal(offers.filter(o => o.is_pickup === (fulfilment === 'pickup')), sortBy),
    [offers, fulfilment, sortBy]
  )
  const cityComparisons = useMemo(
    () => compareByMeal(cityOffers.filter(o => o.is_pickup === (fulfilment === 'pickup')), 'savings_desc'),
    [cityOffers, fulfilment]
  )
  // A meal's cheapest source is the deal we show for it, so it must be the discounted one
  const featured = useMemo(
    () => cityComparisons
      .map(({ best }) => best)
      .filter(o => calculateDiscount(o.old_price_cents ?? 0, o.price_cents) > 0)
      .slice(0, 5),
    [cityComparisons]
  )
  const shelves = useMemo(() => ({
    fastest: [...cityComparisons]
      .filter(c => c.best.eta_minutes)
      .sort((a, b) => (a.best.eta_minutes ?? 0) - (b.best.eta_minutes ?? 0))
      .slice(0, SHELF_SIZE),
    freeDelivery: fulfilment === 'delivery'
      ? cityComparisons.filter(c => c.best.delivery_fee_cents === 0).slice(0, SHELF_SIZE)
      : [],
    topRated: [...cityComparisons]
      .sort((a, b) => b.best.meal.restaurant.rating - a.best.meal.restaurant.rating)
      .slice(0, SHELF_SIZE),
  }), [cityComparisons, fulfilment])

  const isBrowsing = !searchQuery && !aiLabels && !freeDelivery && selectedCategory === 'Kaikki'

  // Load initial offers and refresh when city changes
  useEffect(() => {
    // Fetching on filter change: handleSearch sets loading/results state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleSearch(searchQuery, selectedCategory, sortBy, freeDelivery)
  }, [handleSearch, searchQuery, city, selectedCategory, sortBy, freeDelivery])

  const filterClass = (active: boolean) => `flex flex-shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-bold transition-all ${active
    ? 'bg-brand text-white shadow-md'
    : 'bg-soft text-ink hover:bg-line'
    }`

  return (
    <div className="min-h-screen bg-page pb-20">
      {/* Search first: one box that takes both keywords and sentences */}
      <section className="bg-white px-4 pt-5 pb-5 border-b border-line rounded-b-[2rem] card-shadow relative z-10">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-10">
            <h1 className="flex-shrink-0 text-2xl md:text-3xl font-black text-ink tracking-tight">
              Mitä tekisi mieli <span className="text-brand">syödä?</span>
            </h1>
            <div className="w-full">
              <SearchBar
                onSearch={(q) => looksLikeNaturalLanguage(q)
                  ? handleAiSearch(q)
                  : handleSearch(q, selectedCategory, sortBy, freeDelivery)}
                initialQuery={searchQuery}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <FulfilmentToggle value={fulfilment} onChange={chooseFulfilment} />
            {fulfilment === 'delivery' && (
              <button
                type="button"
                onClick={() => setFreeDelivery(prev => !prev)}
                aria-pressed={freeDelivery}
                className={filterClass(freeDelivery)}
              >
                {freeDelivery && <Check className="w-3.5 h-3.5" />}
                {t.card.free_delivery}
              </button>
            )}
            <button type="button" onClick={() => setSortBy('price_asc')} aria-pressed={sortBy === 'price_asc'} className={filterClass(sortBy === 'price_asc')}>
              {t.card.sort_cheapest}
            </button>
            <button type="button" onClick={() => setSortBy('savings_desc')} aria-pressed={sortBy === 'savings_desc'} className={filterClass(sortBy === 'savings_desc')}>
              {t.card.sort_savings}
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {CATEGORIES.map(({ label }) => (
              <button
                key={label}
                onClick={() => handleSearch('', label, sortBy, freeDelivery)}
                aria-pressed={selectedCategory === label}
                className={`flex-shrink-0 px-5 py-2 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all border ${selectedCategory === label
                  ? 'bg-brand text-white border-brand shadow-lg'
                  : 'bg-white text-ink border-line hover:border-brand/30 hover:bg-soft/50'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-7xl pt-6 pb-20 space-y-10">
        {[...offers, ...cityOffers].some(o => isDemoSource(o.source)) && <DemoNotice />}

        {/* Featured carousel: the city's biggest real discounts */}
        {isBrowsing && featured.length > 0 && (
          <FeaturedCarousel key={`${city}-${fulfilment}`} offers={featured} />
        )}

        {/* Direct-order partner spotlight (additive — separate from the aggregator feed) */}
        {DIRECT_ORDERING_ENABLED && <HomepageDirectRestaurants />}

        {isBrowsing && (
          <>
            <OfferShelf title={t.card.shelf_fastest} comparisons={shelves.fastest} />
            <OfferShelf title={t.card.shelf_free_delivery} comparisons={shelves.freeDelivery} />
            <OfferShelf title={t.card.shelf_top_rated} comparisons={shelves.topRated} />
          </>
        )}

        <section>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-ink tracking-tight">{t.card.all_deals}</h2>
              <p className="text-sm text-subtle font-medium">
                {sortBy === 'price_asc' ? t.card.ranking_price : t.card.ranking_savings} {t.card.ranking_note}
              </p>
            </div>
            <Link href="/search">
              <span className="flex items-center gap-3 text-ink hover:text-brand transition-colors p-3 rounded-2xl bg-white border border-line shadow-sm font-black uppercase text-[10px] tracking-widest group">
                {t.card.see_all}
                <span className="bg-brand group-hover:bg-brand-dark p-1 rounded-lg transition-colors">
                  <ChevronRight className="w-4 h-4 text-white" />
                </span>
              </span>
            </Link>
          </div>

          {aiLabels && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-brand">
                <Sparkles className="w-4 h-4" />
                {t.ai.understood}
              </span>
              {aiLabels.map((label) => (
                <span key={label} className="px-3 py-1.5 rounded-xl bg-soft text-ink text-xs font-bold border border-line">
                  {label}
                </span>
              ))}
              <button
                onClick={clearAiSearch}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-subtle hover:text-brand text-xs font-bold transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                {t.ai.clear}
              </button>
            </div>
          )}

          {!loading && comparisons.length === 0 && (
            aiLabels ? (
              <p className="text-subtle font-medium mb-8">{t.ai.no_results}</p>
            ) : (
              <div className="rounded-[2rem] border-2 border-dashed border-line px-6 py-16 text-center">
                <h3 className="text-lg font-black text-ink mb-2">{t.results.no_results_title}</h3>
                <p className="text-subtle font-medium">{t.results.no_results_desc}</p>
              </div>
            )
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            ) : comparisons.map(({ best, others }) => (
              <OfferCard key={best.id} offer={best} others={others} />
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
