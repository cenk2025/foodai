'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { searchOffers, getCities, SearchParams } from './actions/offers'
import SearchBar from '@/components/search/SearchBar'
import OfferCard from '@/components/offers/OfferCard'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { OfferWithDetails } from '@/lib/types/database'
import { ChevronRight, Sparkles, X } from 'lucide-react'
import Footer from '@/components/layout/Footer'
import OfferPreview from '@/components/offers/OfferPreview'
import FeaturedCarousel from '@/components/offers/FeaturedCarousel'
import DemoNotice from '@/components/offers/DemoNotice'
import { useLocation } from '@/lib/context/LocationContext'
import HomepageDirectRestaurants from '@/components/direct-ordering/HomepageDirectRestaurants'
import { DIRECT_ORDERING_ENABLED } from '@/lib/features'
import { useLanguage } from '@/lib/i18n/context'
import { isDemoSource } from '@/lib/utils'
import { describeIntent, looksLikeNaturalLanguage, type SearchIntent } from '@/lib/ai/search-intent'

export default function HomePage() {
  const { city } = useLocation()
  const { t } = useLanguage()
  const [cities, setCities] = useState<Array<{ id: string; name: string }>>([])
  const [offers, setOffers] = useState<OfferWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Kaikki')
  const [hoveredOffer, setHoveredOffer] = useState<OfferWithDetails | null>(null)

  const [sortBy, setSortBy] = useState<'price_asc' | 'savings_desc'>('price_asc')
  const [freeDelivery, setFreeDelivery] = useState(false)
  // Biggest real discounts in the selected city, for the hero carousel
  const [featured, setFeatured] = useState<OfferWithDetails[]>([])
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
      .then((results) => {
        if (cancelled) return
        setFeatured(results.filter(o => o.old_price_cents && o.old_price_cents > o.price_cents).slice(0, 5))
      })
      .catch(() => { if (!cancelled) setFeatured([]) })
    return () => { cancelled = true }
  }, [cities, city])

  const handleSearch = useCallback(async (
    query: string,
    _city: string,
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

    const params: SearchParams = {
      query: category !== 'Kaikki' ? `${query} ${category}`.trim() : query,
      cityId: targetCityId,
      sortBy: sort,
      freeDelivery: isFreeDel
    }

    if (category === 'Vegaani') {
      params.dietFlags = ['vegan']
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
      setLoading(false)
    } catch (error) {
      console.error(error)
      handleSearch(text, city, selectedCategory, sortBy, freeDelivery)
    }
  }

  const clearAiSearch = () => handleSearch(searchQuery, city, selectedCategory, sortBy, freeDelivery)

  // Load initial offers and refresh when city changes
  useEffect(() => {
    // Fetching on filter change: handleSearch sets loading/results state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleSearch(searchQuery, city, selectedCategory, sortBy, freeDelivery)
  }, [handleSearch, searchQuery, city, selectedCategory, sortBy, freeDelivery])

  return (
    <div className="min-h-screen bg-[#fffcf8] pb-20">
      {/* Search Header Section - Now wider for web */}
      <section className="bg-white px-4 pt-6 pb-10 border-b border-[#f1ebd8] rounded-b-[3rem] card-shadow relative z-10 transition-all duration-500">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-black text-[#3d1d11] tracking-tight">
                Mitä tekisi mieli <span className="text-[#d35400]">syödä?</span>
              </h1>
              <p className="text-[#a08a7e] font-medium">Löydä kaupunkisi parhaat ruokatarjoukset yhdestä paikasta</p>
            </div>

            <div className="w-full lg:max-w-xl">
              <SearchBar
                onSearch={(q, c) => looksLikeNaturalLanguage(q)
                  ? handleAiSearch(q)
                  : handleSearch(q, c, selectedCategory, sortBy, freeDelivery)}
                initialQuery={searchQuery}
                initialCity={city}
                currentSort={sortBy}
                isFreeDelivery={freeDelivery}
                onSortChange={setSortBy}
                onToggleFreeDelivery={() => setFreeDelivery(prev => !prev)}
              />
            </div>
          </div>

          {/* Quick Categories & Filters Tier */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              {['Kaikki', 'Burgerit', 'Sushi', 'Pizza', 'Salaatit', 'Kiinalainen', 'Vegaani', 'Leipomo'].map((tag, i) => (
                <button
                  key={tag}
                  onClick={() => {
                    // If clicking same category, toggle off (back to Kaikki)? Or just select it.
                    // Usually distinct selection.
                    handleSearch('', city, tag, sortBy, freeDelivery)
                  }}
                  className={`flex-shrink-0 px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all border ${selectedCategory === tag
                    ? 'bg-[#3d1d11] text-white border-[#3d1d11] shadow-lg scale-105'
                    : 'bg-white text-[#3d1d11] border-[#f1ebd8] hover:border-[#d35400]/30 hover:bg-[#fdf2e2]/50'
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-7xl pt-10">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 space-y-12">
            {[...offers, ...featured].some(o => isDemoSource(o.source)) && <DemoNotice />}


            {/* Featured carousel: the city's biggest real discounts */}
            {!searchQuery && featured.length > 0 && (
              <FeaturedCarousel key={city} offers={featured} onHover={setHoveredOffer} />
            )}

            {/* Direct-order partner spotlight (additive — separate from the aggregator feed) */}
            {DIRECT_ORDERING_ENABLED && <HomepageDirectRestaurants />}

            {/* Daily Best Deals - Responsive Grid */}
            <section>
              <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[#d35400] text-xs font-black uppercase tracking-[0.2em]">
                    <div className="w-8 h-[2px] bg-[#d35400]" />
                    Top Poiminnat
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-[#3d1d11] tracking-tight">Päivän parhaat <span className="text-[#d35400]">tarjoukset</span></h2>
                  <p className="text-[#a08a7e] font-medium">Tarjoukset alueeltasi yhdessä näkymässä</p>
                </div>
                <Link href="/search">
                  <button className="flex items-center gap-3 text-[#3d1d11] hover:text-[#d35400] transition-colors p-4 rounded-2xl bg-white border border-[#f1ebd8] shadow-sm font-black uppercase text-[10px] tracking-widest group">
                    Katso kaikki
                    <div className="bg-[#3d1d11] group-hover:bg-[#d35400] p-1 rounded-lg transition-colors">
                      <ChevronRight className="w-4 h-4 text-white" />
                    </div>
                  </button>
                </Link>
              </div>

              {aiLabels && (
                <div className="flex flex-wrap items-center gap-2 mb-8">
                  <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#d35400]">
                    <Sparkles className="w-4 h-4" />
                    {t.ai.understood}
                  </span>
                  {aiLabels.map((label) => (
                    <span key={label} className="px-3 py-1.5 rounded-xl bg-[#fdf2e2] text-[#3d1d11] text-xs font-bold border border-[#f1ebd8]">
                      {label}
                    </span>
                  ))}
                  <button
                    onClick={clearAiSearch}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[#a08a7e] hover:text-[#d35400] text-xs font-bold transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    {t.ai.clear}
                  </button>
                </div>
              )}

              {!loading && offers.length === 0 && (
                aiLabels ? (
                  <p className="text-[#a08a7e] font-medium mb-8">{t.ai.no_results}</p>
                ) : (
                  <div className="rounded-[2rem] border-2 border-dashed border-[#f1ebd8] px-6 py-16 text-center">
                    <h3 className="text-lg font-black text-[#3d1d11] mb-2">{t.results.no_results_title}</h3>
                    <p className="text-[#a08a7e] font-medium">{t.results.no_results_desc}</p>
                  </div>
                )
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
                ) : offers.map((offer) => (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    onMouseEnter={() => setHoveredOffer(offer)}
                    onMouseLeave={() => setHoveredOffer(null)}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Desktop Web Sidebar - Sticky Preview & Info */}
          <aside className="hidden xl:block w-[340px] flex-shrink-0">
            <div className="sticky top-8 space-y-8">
              {/* Quick Preview Panel */}
              <div className="app-shadow rounded-[3rem]">
                <OfferPreview offer={hoveredOffer || offers[0] || null} />
              </div>

            </div>
          </aside>
        </div>

      </div>

      <Footer />

    </div>
  )
}
