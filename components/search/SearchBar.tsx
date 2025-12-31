'use client'

import { useState } from 'react'
import { Search, MapPin } from 'lucide-react'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { useLanguage } from '@/lib/i18n/context'

interface SearchBarProps {
    onSearch: (query: string, city: string) => void
    cities: Array<{ id: string; name: string }>
    initialQuery?: string
    initialCity?: string
}

export default function SearchBar({
    onSearch,
    cities,
    initialQuery = '',
    initialCity = ''
}: SearchBarProps) {
    const { t } = useLanguage()
    const [query, setQuery] = useState(initialQuery)
    const [city, setCity] = useState(initialCity)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSearch(query, city)
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 w-full">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                    type="text"
                    placeholder={t.search.placeholder}
                    className="pl-10 h-12 bg-gray-50 dark:bg-zinc-800/50 border-transparent focus:bg-white dark:focus:bg-zinc-900 transition-all text-lg"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <div className="relative md:w-48">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <select
                    className="w-full h-12 pl-10 pr-4 rounded-xl border border-transparent bg-gray-50 dark:bg-zinc-800/50 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:bg-white dark:focus:bg-zinc-900 appearance-none transition-all cursor-pointer"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                >
                    <option value="">{t.search.city_placeholder}</option>
                    {cities.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>

            <Button type="submit" size="lg" className="h-12 px-8 text-lg font-semibold bg-gradient-to-r from-accent to-emerald-500 hover:from-emerald-500 hover:to-accent text-white shadow-lg shadow-emerald-500/20">
                {t.search.button}
            </Button>
        </form>
    )
}
