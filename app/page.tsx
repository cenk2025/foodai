'use client'

import { useState, useEffect } from 'react'
import { searchOffers, getCities, SearchParams } from './actions/offers'
import SearchBar from '@/components/search/SearchBar'
import Filters, { FilterOptions } from '@/components/search/Filters'
import OfferCard from '@/components/offers/OfferCard'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { OfferWithDetails } from '@/lib/types/database'
import { Utensils } from 'lucide-react'

export default function HomePage() {
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
    getCities().then(setCities)
  }, [])

  // Load initial offers
  useEffect(() => {
    handleSearch(searchQuery, selectedCity)
  }, [])

  const handleSearch = async (query: string, cityId: string) => {
    setLoading(true)
    setSearchQuery(query)
    setSelectedCity(cityId)

    const searchParams: SearchParams = {
      query: query || undefined,
      cityId: cityId || undefined,
      maxPrice: filters.maxPrice,
      dietFlags: filters.dietFlags.length > 0 ? filters.dietFlags : undefined,
      minRating: filters.minRating,
      deliveryOnly: filters.deliveryOnly,
      pickupOnly: filters.pickupOnly,
      sortBy: filters.sortBy,
    }

    const results = await searchOffers(searchParams)
    setOffers(results)
    setLoading(false)
  }

  const handleFilterChange = async (newFilters: FilterOptions) => {
    setFilters(newFilters)
    setLoading(true)

    const searchParams: SearchParams = {
      query: searchQuery || undefined,
      cityId: selectedCity || undefined,
      maxPrice: newFilters.maxPrice,
      dietFlags: newFilters.dietFlags.length > 0 ? newFilters.dietFlags : undefined,
      minRating: newFilters.minRating,
      deliveryOnly: newFilters.deliveryOnly,
      pickupOnly: newFilters.pickupOnly,
      sortBy: newFilters.sortBy,
    }

    const results = await searchOffers(searchParams)
    setOffers(results)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Find the <span className="gradient-text">Cheapest Meals</span> in Finland
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Compare prices from multiple platforms and save money on every order
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <SearchBar
              onSearch={handleSearch}
              cities={cities}
              initialQuery={searchQuery}
              initialCity={selectedCity}
            />
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Filters onFilterChange={handleFilterChange} initialFilters={filters} />

        {/* Results Count */}
        {!loading && (
          <div className="mb-6">
            <p className="text-muted-foreground">
              {offers.length} {offers.length === 1 ? 'offer' : 'offers'} found
            </p>
          </div>
        )}

        {/* Offers Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : offers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
              <Utensils className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No offers found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">
              FoodAi - Find the cheapest meals in Finland
            </p>
            <p>
              Demo version • Prices are for demonstration purposes only
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
