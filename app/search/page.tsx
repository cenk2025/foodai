'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    ArrowLeft,
    Search as SearchIcon,
    Utensils,
    ChefHat,
    Pizza,
    Coffee,
    ChevronRight,
    TrendingDown,
    Filter
} from 'lucide-react'

export default function SearchPage() {
    const router = useRouter()
    const [query, setQuery] = useState('')

    const categories = [
        { name: 'Pizza', icon: Pizza, color: '#f3d179' },
        { name: 'Burger', icon: Utensils, color: '#d35400' },
        { name: 'Kahvi', icon: Coffee, color: '#3d1d11' },
        { name: 'Sushi', icon: ChefHat, color: '#27ae60' },
    ]

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
                    <h1 className="text-4xl font-black text-white mb-8">Etunnistatko herkkusi?</h1>

                    <div className="relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#a08a7e] group-focus-within:text-[#d35400] transition-colors">
                            <SearchIcon className="w-6 h-6" />
                        </div>
                        <input
                            type="text"
                            placeholder="Etsi ravintolaa tai ruokaa..."
                            className="w-full bg-white border-none rounded-[2rem] py-6 pl-16 pr-6 text-lg focus:ring-4 focus:ring-[#f3d179]/50 transition-all font-medium app-shadow"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                        />
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#3d1d11] text-white p-3 rounded-2xl hover:bg-[#d35400] transition-all">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
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
                        {['Pizza', 'Burgerit', 'Sushit', 'Lounas', 'Helsinki', 'Vegan', 'Kotiinkuljetus'].map((tag) => (
                            <button key={tag} className="px-6 py-3 rounded-2xl bg-[#fdf2e2]/30 text-[#3d1d11] text-sm font-bold border border-[#f1ebd8] hover:bg-[#d35400] hover:text-white hover:border-[#d35400] transition-all">
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Categories Grid */}
                <div>
                    <h2 className="text-2xl font-black text-[#3d1d11] mb-8">Selaa kategorioittain</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {categories.map((cat) => (
                            <div key={cat.name} className="bg-white p-8 rounded-[2.5rem] border border-[#f1ebd8] app-shadow hover:translate-y-[-8px] transition-all cursor-pointer group text-center">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                                    <cat.icon className="w-8 h-8" />
                                </div>
                                <span className="font-black text-[#3d1d11] uppercase text-xs tracking-widest">{cat.name}</span>
                            </div>
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
            </div>
        </div>
    )
}
