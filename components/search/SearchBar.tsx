'use client'

import { useState } from 'react'
import { Search, ChevronRight } from 'lucide-react'

interface SearchBarProps {
    onSearch: (query: string, city: string) => void
    initialQuery?: string
    initialCity?: string
    currentSort?: string
    isFreeDelivery?: boolean
    onSortChange: (sort: 'price_asc' | 'savings_desc') => void
    onToggleFreeDelivery: () => void
}

export default function SearchBar({
    onSearch,
    initialQuery = '',
    initialCity = '',
    currentSort = 'price_asc',
    isFreeDelivery = false,
    onSortChange,
    onToggleFreeDelivery
}: SearchBarProps) {
    const [query, setQuery] = useState(initialQuery)
    const [city] = useState(initialCity)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSearch(query, city)
    }

    return (
        <form onSubmit={handleSubmit} className="search-container">
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a08a7e] group-focus-within:text-[#d35400] transition-colors">
                    <Search className="w-5 h-5" />
                </div>
                <input
                    type="text"
                    placeholder="Hae italialaista tai muuta herkkua..."
                    className="search-input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-[#3d1d11] text-white flex items-center justify-center hover:bg-[#d35400] transition-all active:scale-90 shadow-sm"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Optional: Horizontal City Chips or Filter Pill */}
            <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-2">
                <button
                    type="button"
                    onClick={() => onSortChange('price_asc')}
                    className={`text-[11px] font-bold px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer transition-all ${currentSort === 'price_asc'
                        ? 'bg-[#3d1d11] text-white shadow-md'
                        : 'bg-[#fdf2e2] text-[#3d1d11] border border-[#3d1d11]/5 hover:bg-[#f3d179]'
                        }`}
                >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M4 6h16M4 12h10M4 18h16" strokeLinecap="round" />
                    </svg>
                    Hinta: Alhaisin
                </button>

                <button
                    type="button"
                    onClick={onToggleFreeDelivery}
                    className={`text-[11px] font-bold px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer transition-all ${isFreeDelivery
                        ? 'bg-[#3d1d11] text-white shadow-md'
                        : 'bg-[#fdf2e2] text-[#3d1d11] border border-[#3d1d11]/5 hover:bg-[#f3d179]'
                        }`}
                >
                    <svg className={`w-3.5 h-3.5 ${isFreeDelivery ? 'text-white' : 'text-[#3d1d11]/60'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Ilmainen kuljetus
                </button>

                <button
                    type="button"
                    onClick={() => onSortChange('savings_desc')}
                    className={`text-[11px] font-bold px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer transition-all ${currentSort === 'savings_desc'
                        ? 'bg-[#3d1d11] text-white shadow-md'
                        : 'bg-[#fdf2e2] text-[#3d1d11] border border-[#3d1d11]/5 hover:bg-[#f3d179]'
                        }`}
                >
                    <svg className={`w-3.5 h-3.5 ${currentSort === 'savings_desc' ? 'text-white' : 'text-[#e67e22]'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M7 7l3 3m0 0l3-3m-3 3l-3 3m3-3l3 3" strokeLinecap="round" />
                    </svg>
                    Säästö %
                </button>
            </div>
        </form>
    )
}
