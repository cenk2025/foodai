'use client'

import { useState } from 'react'
import { Sparkles, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'

interface SearchBarProps {
    onSearch: (query: string) => void
    initialQuery?: string
}

export default function SearchBar({ onSearch, initialQuery = '' }: SearchBarProps) {
    const { t } = useLanguage()
    const [query, setQuery] = useState(initialQuery)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSearch(query)
    }

    return (
        <form onSubmit={handleSubmit} role="search" className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d35400]">
                <Sparkles className="w-5 h-5" />
            </div>
            <input
                type="text"
                aria-label={t.ai.search_label}
                placeholder={t.ai.search_placeholder}
                className="w-full rounded-2xl border border-[#f1ebd8] bg-white py-4 pl-12 pr-16 text-sm font-medium text-[#3d1d11] shadow-sm outline-none transition-all placeholder:text-[#a08a7e] focus:border-[#d35400] focus:ring-2 focus:ring-[#d35400]/20 text-ellipsis"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button
                type="submit"
                aria-label={t.search.button}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-[#3d1d11] text-white flex items-center justify-center hover:bg-[#d35400] transition-all active:scale-90 shadow-sm"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </form>
    )
}
