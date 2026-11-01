'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
    ArrowLeft,
    Search as SearchIcon,
    Utensils,
    ChefHat,
    Pizza,
    Sandwich,
    TrendingDown,
    Sparkles,
    X,
} from 'lucide-react'
import { searchOffers, getCities, type SearchParams } from '@/app/actions/offers'
import OfferCard from '@/components/offers/OfferCard'
import DemoNotice from '@/components/offers/DemoNotice'
import { isDemoSource } from '@/lib/utils'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { useLocation } from '@/lib/context/LocationContext'
import { useLanguage } from '@/lib/i18n/context'
import { describeIntent, looksLikeNaturalLanguage, type SearchIntent } from '@/lib/ai/search-intent'
import type { OfferWithDetails } from '@/lib/types/database'

type Preset = { label: string; params: Omit<SearchParams, 'cityId'> }

const POPULAR: Preset[] = [
    { label: 'Pizza', params: { query: 'pizza' } },
    { label: 'Burgerit', params: { query: 'burger' } },
    { label: 'Sushit', params: { query: 'sushi' } },
    { label: 'Kebab', params: { query: 'kebab' } },
    { label: 'Lounas', params: { query: 'lunch' } },
    { label: 'Vegaani', params: { dietFlags: ['vegan'] } },
    { label: 'Ilmainen toimitus', params: { freeDelivery: true } },
    { label: 'Suurimmat alennukset', params: { sortBy: 'savings_desc' } },
]

const CATEGORIES = [
    { name: 'Pizza', icon: Pizza, color: '#f3d179', params: { query: 'pizza' } },
    { name: 'Burger', icon: Sandwich, color: '#d35400', params: { query: 'burger' } },
    { name: 'Kebab', icon: Utensils, color: '#3d1d11', params: { query: 'kebab' } },
    { name: 'Sushi', icon: ChefHat, color: '#27ae60', params: { query: 'sushi' } },
]

// Meal names in the data are English; map common Finnish keywords so plain
// keyword searches (no AI) still find them.
const FINNISH_KEYWORDS: Record<string, string> = {
    pizzat: 'pizza', pitsa: 'pizza', burgeri: 'burger', burgerit: 'burger', hampurilainen: 'burger',
    sushit: 'sushi', kebabit: 'kebab', salaatti: 'salad', salaatit: 'salad', keitto: 'soup',
    lounas: 'lunch', kana: 'chicken', kanaa: 'chicken', lohi: 'salmon', pastat: 'pasta',
}

function keywordParams(text: string): Omit<SearchParams, 'cityId'> {
    const word = text.trim().toLowerCase()
    if (word === 'vegaani' || word === 'vegaaninen' || word === 'vegan') return { dietFlags: ['vegan'] }
    return { query: FINNISH_KEYWORDS[word] ?? word }
}

function SearchPageContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const urlQuery = searchParams.get('q') ?? ''
    const { city } = useLocation()
    const { t } = useLanguage()

    const [cities, setCities] = useState<Array<{ id: string; name: string }> | null>(null)
    const [query, setQuery] = useState(urlQuery)
    const [results, setResults] = useState<OfferWithDetails[] | null>(null)
    const [loading, setLoading] = useState(false)
    const [aiLabels, setAiLabels] = useState<string[] | null>(null)
    const [activeLabel, setActiveLabel] = useState<string | null>(null)

    useEffect(() => {
        getCities().then(setCities)
    }, [])

    const runPreset = useCallback(async (label: string, params: Omit<SearchParams, 'cityId'>) => {
        setLoading(true)
        setAiLabels(null)
        setActiveLabel(label)
        const cityId = cities?.find((c) => c.name.toLowerCase() === city.toLowerCase())?.id
        try {
            setResults(await searchOffers({ sortBy: 'price_asc', ...params, cityId }))
        } catch (error) {
            console.error('Search error:', error)
            setResults([])
        } finally {
            setLoading(false)
        }
    }, [cities, city])

    const runText = useCallback(async (text: string) => {
        const trimmed = text.trim()
        if (!trimmed) return
        if (looksLikeNaturalLanguage(trimmed)) {
            setLoading(true)
            setActiveLabel(null)
            try {
                const res = await fetch('/api/ai/search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: trimmed, city }),
                })
                if (!res.ok) throw new Error(`AI search failed: ${res.status}`)
                const data = (await res.json()) as { intent: SearchIntent; city: string | null; offers: OfferWithDetails[] }
                setResults(data.offers)
                setAiLabels(describeIntent(data.intent, data.city, t.ai))
                setLoading(false)
                return
            } catch (error) {
                // AI unavailable: fall back to a plain keyword search
                console.error(error)
            }
        }
        await runPreset(trimmed, keywordParams(trimmed))
    }, [city, t.ai, runPreset])

    // ?q= drives the search, so results survive reloads and footer/shared links work.
    useEffect(() => {
        if (!urlQuery || cities === null) return
        // Fetching on URL change: runText sets loading/results state.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        runText(urlQuery)
    }, [urlQuery, cities, runText])

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        const trimmed = query.trim()
        if (!trimmed) return
        if (trimmed === urlQuery) runText(trimmed)
        else router.replace(`/search?q=${encodeURIComponent(trimmed)}`, { scroll: false })
    }

    const choosePreset = (preset: Preset) => {
        setQuery('')
        router.replace('/search', { scroll: false })
        runPreset(preset.label, preset.params)
    }

    const clear = () => {
        setQuery('')
        setResults(null)
        setAiLabels(null)
        setActiveLabel(null)
        router.replace('/search', { scroll: false })
    }

    const showResults = loading || results !== null

    return (
        <div className="min-h-screen bg-[#fffcf8] font-outfit pb-24 md:pb-12">
            {/* Search Header */}
            <div className="bg-[#3d1d11] pt-16 pb-32 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-[#d35400]/20 rounded-full blur-3xl transform rotate-12" />
                </div>

                <div className="container mx-auto px-6 relative z-10 max-w-4xl">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Takaisin</span>
                    </Link>
                    <h1 className="text-4xl font-black text-white mb-3">Mitä tekisi mieli?</h1>
                    <p className="text-white/60 font-medium mb-8">
                        Hae ruokaa tai kirjoita toiveesi omin sanoin, esim. &quot;vegaaninen alle 12 € ilmaisella toimituksella&quot;.
                    </p>

                    <form onSubmit={submit} className="relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#a08a7e] group-focus-within:text-[#d35400] transition-colors">
                            <SearchIcon className="w-6 h-6" />
                        </div>
                        <input
                            type="search"
                            placeholder="Etsi ravintolaa tai ruokaa..."
                            className="w-full bg-white border-none rounded-[2rem] py-6 pl-16 pr-20 text-lg focus:ring-4 focus:ring-[#f3d179]/50 transition-all font-medium app-shadow"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            maxLength={200}
                            autoFocus
                        />
                        <button
                            type="submit"
                            aria-label="Hae"
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#3d1d11] text-white p-3 rounded-2xl hover:bg-[#d35400] transition-all"
                        >
                            <SearchIcon className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>

            <div className="container mx-auto px-6 max-w-4xl -mt-16 relative z-20 space-y-12">
                {/* Popular Searches */}
                <div className="bg-white rounded-[3rem] p-10 app-shadow border border-[#f1ebd8]">
                    <h2 className="text-xl font-black text-[#3d1d11] mb-8 uppercase tracking-widest flex items-center gap-3">
                        <TrendingDown className="w-5 h-5 text-[#d35400]" />
                        Suosituimmat haut
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {POPULAR.map((preset) => (
                            <button
                                key={preset.label}
                                onClick={() => choosePreset(preset)}
                                className={`px-6 py-3 rounded-2xl text-sm font-bold border transition-all ${activeLabel === preset.label
                                    ? 'bg-[#d35400] text-white border-[#d35400]'
                                    : 'bg-[#fdf2e2]/30 text-[#3d1d11] border-[#f1ebd8] hover:bg-[#d35400] hover:text-white hover:border-[#d35400]'}`}
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>
                </div>

                {showResults ? (
                    <section>
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <h2 className="text-2xl font-black text-[#3d1d11]">
                                {loading ? 'Haetaan…' : `${results?.length ?? 0} tarjousta`}
                                {!loading && city && <span className="text-[#a08a7e] font-medium text-base"> · {city}</span>}
                            </h2>
                            <button onClick={clear} className="flex items-center gap-1 text-[#a08a7e] hover:text-[#d35400] text-xs font-bold uppercase tracking-widest transition-colors">
                                <X className="w-4 h-4" />
                                {t.ai.clear}
                            </button>
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
                            </div>
                        )}

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
                            </div>
                        ) : results && results.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {results.some(o => isDemoSource(o.source)) && <DemoNotice className="md:col-span-2" />}
                                {results.map((offer) => <OfferCard key={offer.id} offer={offer} />)}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white rounded-[3rem] border border-[#f1ebd8]">
                                <h3 className="text-xl font-black text-[#3d1d11] mb-2">Ei tarjouksia</h3>
                                <p className="text-[#a08a7e] font-medium max-w-sm mx-auto">{t.ai.no_results}</p>
                            </div>
                        )}
                    </section>
                ) : (
                    <>
                        {/* Categories Grid */}
                        <div>
                            <h2 className="text-2xl font-black text-[#3d1d11] mb-8">Selaa kategorioittain</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.name}
                                        onClick={() => choosePreset({ label: cat.name, params: cat.params })}
                                        className="bg-white p-8 rounded-[2.5rem] border border-[#f1ebd8] app-shadow hover:translate-y-[-8px] transition-all cursor-pointer group text-center"
                                    >
                                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                                            <cat.icon className="w-8 h-8" />
                                        </div>
                                        <span className="font-black text-[#3d1d11] uppercase text-xs tracking-widest">{cat.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Empty State / Prompt */}
                        <div className="text-center py-20">
                            <div className="w-24 h-24 bg-[#fdf2e2]/50 rounded-[2.5rem] flex items-center justify-center text-[#a08a7e]/30 mx-auto mb-8">
                                <Utensils className="w-12 h-12" />
                            </div>
                            <h3 className="text-2xl font-black text-[#3d1d11] mb-3">Aloita haku ylhäältä</h3>
                            <p className="text-[#a08a7e] font-medium max-w-xs mx-auto">Löydämme sinulle kaupungin parhaat diilit ja herkullisimmat ruoka-annokset silmänräpäyksessä.</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

// useSearchParams needs a Suspense boundary for static rendering.
export default function SearchPage() {
    return (
        <Suspense>
            <SearchPageContent />
        </Suspense>
    )
}
