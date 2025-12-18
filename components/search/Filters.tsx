'use client'

import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

export interface FilterOptions {
    maxPrice?: number
    dietFlags: string[]
    minRating?: number
    deliveryOnly: boolean
    pickupOnly: boolean
    sortBy: 'price_asc' | 'price_desc' | 'rating' | 'eta'
}

interface FiltersProps {
    onFilterChange: (filters: FilterOptions) => void
    initialFilters?: Partial<FilterOptions>
}

const DIET_OPTIONS = [
    { value: 'vegan', label: 'Vegan', variant: 'vegan' as const },
    { value: 'vegetarian', label: 'Vegetarian', variant: 'vegetarian' as const },
    { value: 'halal', label: 'Halal', variant: 'halal' as const },
    { value: 'gluten_free', label: 'Gluten-Free', variant: 'gluten-free' as const },
]

const SORT_OPTIONS = [
    { value: 'price_asc', label: 'Cheapest First' },
    { value: 'price_desc', label: 'Most Expensive' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'eta', label: 'Fastest Delivery' },
]

export default function Filters({ onFilterChange, initialFilters }: FiltersProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [filters, setFilters] = useState<FilterOptions>({
        maxPrice: initialFilters?.maxPrice,
        dietFlags: initialFilters?.dietFlags || [],
        minRating: initialFilters?.minRating,
        deliveryOnly: initialFilters?.deliveryOnly || false,
        pickupOnly: initialFilters?.pickupOnly || false,
        sortBy: initialFilters?.sortBy || 'price_asc',
    })

    const handleDietToggle = (diet: string) => {
        const newDietFlags = filters.dietFlags.includes(diet)
            ? filters.dietFlags.filter(d => d !== diet)
            : [...filters.dietFlags, diet]

        const newFilters = { ...filters, dietFlags: newDietFlags }
        setFilters(newFilters)
        onFilterChange(newFilters)
    }

    const handleSortChange = (sortBy: FilterOptions['sortBy']) => {
        const newFilters = { ...filters, sortBy }
        setFilters(newFilters)
        onFilterChange(newFilters)
    }

    const handleMaxPriceChange = (value: string) => {
        const maxPrice = value ? parseInt(value) * 100 : undefined
        const newFilters = { ...filters, maxPrice }
        setFilters(newFilters)
        onFilterChange(newFilters)
    }

    const handleMinRatingChange = (value: string) => {
        const minRating = value ? parseFloat(value) : undefined
        const newFilters = { ...filters, minRating }
        setFilters(newFilters)
        onFilterChange(newFilters)
    }

    const handleDeliveryToggle = () => {
        const newFilters = {
            ...filters,
            deliveryOnly: !filters.deliveryOnly,
            pickupOnly: false
        }
        setFilters(newFilters)
        onFilterChange(newFilters)
    }

    const handlePickupToggle = () => {
        const newFilters = {
            ...filters,
            pickupOnly: !filters.pickupOnly,
            deliveryOnly: false
        }
        setFilters(newFilters)
        onFilterChange(newFilters)
    }

    const activeFilterCount =
        (filters.maxPrice ? 1 : 0) +
        filters.dietFlags.length +
        (filters.minRating ? 1 : 0) +
        (filters.deliveryOnly ? 1 : 0) +
        (filters.pickupOnly ? 1 : 0)

    return (
        <div className="w-full">
            {/* Filter Toggle Button */}
            <div className="flex items-center justify-between mb-4">
                <Button
                    variant="outline"
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative"
                >
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filters
                    {activeFilterCount > 0 && (
                        <Badge variant="accent" className="ml-2">
                            {activeFilterCount}
                        </Badge>
                    )}
                </Button>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
                    <select
                        value={filters.sortBy}
                        onChange={(e) => handleSortChange(e.target.value as FilterOptions['sortBy'])}
                        className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm cursor-pointer transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        {SORT_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Filter Panel */}
            {isOpen && (
                <div className="glass rounded-xl p-6 mb-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Diet Filters */}
                    <div>
                        <h3 className="text-sm font-semibold mb-3">Dietary Preferences</h3>
                        <div className="flex flex-wrap gap-2">
                            {DIET_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleDietToggle(option.value)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-smooth ${filters.dietFlags.includes(option.value)
                                            ? 'bg-accent text-accent-foreground'
                                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price & Rating */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold mb-2 block">
                                Max Price (€)
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="1"
                                placeholder="No limit"
                                value={filters.maxPrice ? filters.maxPrice / 100 : ''}
                                onChange={(e) => handleMaxPriceChange(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold mb-2 block">
                                Min Rating
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="5"
                                step="0.5"
                                placeholder="Any rating"
                                value={filters.minRating || ''}
                                onChange={(e) => handleMinRatingChange(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                    </div>

                    {/* Delivery Options */}
                    <div>
                        <h3 className="text-sm font-semibold mb-3">Fulfillment</h3>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDeliveryToggle}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${filters.deliveryOnly
                                        ? 'bg-accent text-accent-foreground'
                                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                    }`}
                            >
                                Delivery Only
                            </button>
                            <button
                                onClick={handlePickupToggle}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${filters.pickupOnly
                                        ? 'bg-accent text-accent-foreground'
                                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                    }`}
                            >
                                Pickup Only
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
