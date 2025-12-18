'use client'

import { useState } from 'react'
import { Search, MapPin } from 'lucide-react'
import Input from '../ui/Input'
import Button from '../ui/Button'

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
    const [query, setQuery] = useState(initialQuery)
    const [selectedCity, setSelectedCity] = useState(initialCity)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSearch(query, selectedCity)
    }

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col md:flex-row gap-3 w-full">
                {/* Search Input */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                    <Input
                        type="text"
                        placeholder="Search for pizza, kebab, sushi..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* City Selector */}
                <div className="relative md:w-64">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                    <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-foreground appearance-none cursor-pointer transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        <option value="">All Cities</option>
                        {cities.map((city) => (
                            <option key={city.id} value={city.id}>
                                {city.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Search Button */}
                <Button type="submit" variant="accent" size="md" className="md:w-auto">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                </Button>
            </div>
        </form>
    )
}
