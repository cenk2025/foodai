'use client'

import { SlidersHorizontal, ChevronDown, Check, X } from 'lucide-react'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { useLanguage } from '@/lib/i18n/context'
import { useState } from 'react'

export interface FilterOptions {
    maxPrice?: number
    dietFlags: string[]
    minRating?: number
    deliveryOnly: boolean
    pickupOnly: boolean
    sortBy: 'price_asc' | 'price_desc' | 'rating' | 'eta'
}

interface FiltersProps {
    filters: FilterOptions
    onFilterChange: (filters: FilterOptions) => void
}

export default function Filters({ filters, onFilterChange }: FiltersProps) {
    const { t } = useLanguage()
    const [isOpen, setIsOpen] = useState(false)

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFilterChange({ ...filters, sortBy: e.target.value as any })
    }

    const toggleDietFlag = (flag: string) => {
        const newFlags = filters.dietFlags.includes(flag)
            ? filters.dietFlags.filter(f => f !== flag)
            : [...filters.dietFlags, flag]
        onFilterChange({ ...filters, dietFlags: newFlags })
    }

    return (
        <div className="w-full mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <Button
                    variant="outline"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2"
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    {t.filters.title}
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </Button>

                <div className="flex items-center gap-3 ml-auto">
                    <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block">
                        {t.filters.sort_by}
                    </span>
                    <select
                        className="bg-background border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary h-10 cursor-pointer"
                        value={filters.sortBy}
                        onChange={handleSortChange}
                    >
                        <option value="price_asc">{t.filters.sort_options.price_asc}</option>
                        <option value="price_desc">{t.filters.sort_options.price_desc}</option>
                        <option value="rating">{t.filters.sort_options.rating}</option>
                        <option value="eta">{t.filters.sort_options.eta}</option>
                    </select>
                </div>
            </div>

            {/* Expanded Filters */}
            {isOpen && (
                <div className="p-6 bg-card rounded-xl border border-border shadow-sm animate-in slide-in-from-top-2 fade-in duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                        {/* Diet */}
                        <div>
                            <h4 className="font-semibold mb-3">{t.filters.diet.healthy} / {t.filters.diet.vegan}</h4>
                            <div className="flex flex-wrap gap-2">
                                {['vegan', 'gluten_free', 'healthy', 'pescatarian'].map(flag => (
                                    <Badge
                                        key={flag}
                                        variant={filters.dietFlags.includes(flag) ? 'success' : 'default'}
                                        className="cursor-pointer select-none hover:opacity-80 transition-opacity"
                                        onClick={() => toggleDietFlag(flag)}
                                    >
                                        {filters.dietFlags.includes(flag) && <Check className="w-3 h-3 mr-1" />}
                                        {t.filters.diet[flag as keyof typeof t.filters.diet] || flag}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div>
                            <h4 className="font-semibold mb-3">{t.filters.max_price}</h4>
                            <input
                                type="range"
                                min="500"
                                max="3000"
                                step="100"
                                className="w-full accent-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                value={filters.maxPrice || 3000}
                                onChange={(e) => onFilterChange({ ...filters, maxPrice: parseInt(e.target.value) })}
                            />
                            <div className="flex justify-between text-sm text-muted-foreground mt-1">
                                <span>€5</span>
                                <span>€{(filters.maxPrice || 3000) / 100}</span>
                            </div>
                        </div>

                        {/* Rating */}
                        <div>
                            <h4 className="font-semibold mb-3">{t.filters.min_rating}</h4>
                            <div className="flex gap-2">
                                {[3, 3.5, 4, 4.5].map(rating => (
                                    <button
                                        key={rating}
                                        onClick={() => onFilterChange({ ...filters, minRating: filters.minRating === rating ? undefined : rating })}
                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors border ${filters.minRating === rating
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-background hover:bg-muted border-input'
                                            }`}
                                    >
                                        {rating}+
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Delivery Mode */}
                        <div>
                            <h4 className="font-semibold mb-3">{t.filters.delivery_only.split(' ')[0]}</h4>
                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={filters.deliveryOnly}
                                        onChange={() => onFilterChange({ ...filters, deliveryOnly: !filters.deliveryOnly, pickupOnly: false })}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    {t.filters.delivery_only}
                                </label>
                                <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={filters.pickupOnly}
                                        onChange={() => onFilterChange({ ...filters, pickupOnly: !filters.pickupOnly, deliveryOnly: false })}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    {t.filters.pickup_only}
                                </label>
                            </div>
                        </div>

                    </div>

                    <div className="mt-6 flex justify-end pt-4 border-t border-border">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onFilterChange({
                                dietFlags: [],
                                deliveryOnly: false,
                                pickupOnly: false,
                                sortBy: 'price_asc'
                            })}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Reset
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
