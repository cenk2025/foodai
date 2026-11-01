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
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand">
                <Sparkles className="w-5 h-5" />
            </div>
            <input
                type="text"
                aria-label={t.ai.search_label}
                placeholder={t.ai.search_placeholder}
                className="w-full rounded-2xl border border-line bg-white py-4 pl-12 pr-16 text-sm font-medium text-ink shadow-sm outline-none transition-all placeholder:text-subtle focus:border-brand focus:ring-2 focus:ring-brand/20 text-ellipsis"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button
                type="submit"
                aria-label={t.search.button}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center hover:bg-brand-dark transition-all active:scale-90 shadow-sm"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </form>
    )
}
