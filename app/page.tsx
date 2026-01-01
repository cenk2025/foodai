'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { searchOffers, getCities, SearchParams } from './actions/offers'
import SearchBar from '@/components/search/SearchBar'
import Filters, { FilterOptions } from '@/components/search/Filters'
import OfferCard from '@/components/offers/OfferCard'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { OfferWithDetails } from '@/lib/types/database'
import { Utensils, TrendingDown, Clock, Star } from 'lucide-react'
import Footer from '@/components/layout/Footer'
import { useLanguage } from '@/lib/i18n/context'

export default function HomePage() {
  const { t } = useLanguage()
  const [cities, setCities] = useState<Array<{ id: string; name: string }>>([])
  const [offers, setOffers] = useState<OfferWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [filters, setFilters] = useState<FilterOptions>({
    dietFlags: [],
    deliveryOnly: false,
    pickupOnly: false,
    sortBy: 'price_asc',
  })

  // Load cities on mount
  useEffect(() => {
    getCities().then((data) => {
      setCities(data)
    })
  }, [])

  // Load initial offers
  useEffect(() => {
    handleSearch(searchQuery, selectedCity)
  }, [])

  const generateDemoOffers = (): OfferWithDetails[] => {
    const demoDeals = [
      {
        id: '1',
        meal: { name: 'Gourmet Pepperoni Pizza', restaurant: { name: 'Napoli Woodfire', rating: 4.8, city: { name: 'Helsinki' } }, diet_flags: [], image_path: 'pizza' },
        source: { name: 'Wolt' },
        price_cents: 1290,
        old_price_cents: 1650,
        delivery_fee_cents: 0,
        eta_minutes: 35
      },
      {
        id: '2',
        meal: { name: 'Sushi Selection Platter', restaurant: { name: 'Sakura Sushi', rating: 4.6, city: { name: 'Espoo' } }, diet_flags: ['gluten_free'], image_path: 'sushi' },
        source: { name: 'Foodora' },
        price_cents: 1850,
        old_price_cents: 2200,
        delivery_fee_cents: 390,
        eta_minutes: 45
      },
      {
        id: '3',
        meal: { name: 'Double Cheese Smashburger', restaurant: { name: 'Burger Co.', rating: 4.5, city: { name: 'Tampere' } }, diet_flags: [], image_path: 'burger' },
        source: { name: 'UberEats' },
        price_cents: 1090,
        old_price_cents: null,
        delivery_fee_cents: 190,
        eta_minutes: 25
      },
      {
        id: '4',
        meal: { name: 'Vegan Buddha Bowl', restaurant: { name: 'Green Leaf', rating: 4.9, city: { name: 'Helsinki' } }, diet_flags: ['vegan', 'healthy'], image_path: 'pizza' },
        source: { name: 'Wolt' },
        price_cents: 1450,
        old_price_cents: 1590,
        delivery_fee_cents: 0,
        eta_minutes: 30
      },
      {
        id: '5',
        meal: { name: 'BBQ Chicken Pizza', restaurant: { name: 'Pizza Hut', rating: 4.2, city: { name: 'Vantaa' } }, diet_flags: [], image_path: 'pizza' },
        source: { name: 'Foodora' },
        price_cents: 1390,
        old_price_cents: 1890,
        delivery_fee_cents: 290,
        eta_minutes: 40
      },
      {
        id: '6',
        meal: { name: 'Salmon Nigiri Set (12pc)', restaurant: { name: 'Oishii Kitchen', rating: 4.7, city: { name: 'Helsinki' } }, diet_flags: ['pescatarian'], image_path: 'sushi' },
        source: { name: 'Wolt' },
        price_cents: 1600,
        old_price_cents: null,
        delivery_fee_cents: 490,
        eta_minutes: 50
      },
    ]

    return demoDeals as unknown as OfferWithDetails[]
  }

  const handleSearch = async (query: string, city: string) => {
    setLoading(true)
    setSearchQuery(query)
    setSelectedCity(city)

    const params: SearchParams = {
      query,
      cityId: city,
      dietFlags: filters.dietFlags,
      deliveryOnly: filters.deliveryOnly,
      pickupOnly: filters.pickupOnly,
      sortBy: filters.sortBy,
    }

    try {
      const results = await searchOffers(params)
      if (results && results.length > 0) {
        setOffers(results)
      } else {
        setOffers(generateDemoOffers())
      }
    } catch (error) {
      console.error('Search error:', error)
      setOffers(generateDemoOffers())
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
    handleSearch(searchQuery, selectedCity)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Modern, Bold, Food-focused */}
      <section className="relative overflow-hidden bg-gradient-to-br from-food-cream via-white to-food-cream dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-96 h-96 bg-food-orange rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-food-green rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              <div className="inline-block">
                <span className="px-4 py-2 bg-food-orange/10 text-food-orange rounded-full text-sm font-semibold">
                  {t.hero.badge}
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-foreground">{t.hero.title_start} </span>
                <span className="gradient-text">{t.hero.title_gradient}</span>
                <span className="text-foreground"> {t.hero.title_end}</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-xl">
                {t.hero.subtitle}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-3 rounded-full border-4 border-food-orange/20 flex items-center justify-center">
                    <span className="text-3xl font-bold text-food-orange">06</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Kaupunkia</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-3 rounded-full border-4 border-food-green/20 flex items-center justify-center">
                    <span className="text-3xl font-bold text-food-green">10</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Ravintolaa</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-3 rounded-full border-4 border-food-yellow/20 flex items-center justify-center">
                    <span className="text-3xl font-bold text-food-yellow">20</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Tarjousta</p>
                </div>
              </div>
            </div>

            {/* Right: Hero Image */}
            <div className="relative">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Floating Pizza Image */}
                <div className="absolute inset-0 animate-float">
                  <Image
                    src="/images/pizza.jpg"
                    alt="Delicious Pizza"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-food-green/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-food-orange/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white dark:bg-zinc-900 border-y border-border">
        <div className="container mx-auto px-4 py-8">
          <SearchBar
            onSearch={handleSearch}
            cities={cities}
            initialQuery={searchQuery}
            initialCity={selectedCity}
          />
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Sticky on Desktop */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 food-card-shadow sticky top-24">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                {t.filters.title}
              </h3>
              <Filters onFilterChange={handleFilterChange} filters={filters} />
            </div>
          </aside>

          {/* Results Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t.results.trending}</h2>
                <p className="text-slate-500 text-sm">{t.results.subtitle}</p>
              </div>
              <div className="text-sm font-medium text-slate-500">
                {offers.length} {offers.length === 1 ? t.results.count_one : t.results.count_many}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : offers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {offers.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-gray-200 dark:border-zinc-800">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-800 mb-4">
                  <Utensils className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t.results.no_results_title}</h3>
                <p className="text-muted-foreground mb-6">
                  {t.results.no_results_desc}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
