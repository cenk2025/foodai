'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
    ArrowLeft,
    Heart,
    Star,
    ChefHat,
    ShoppingBag,
    TrendingDown,
    ChevronRight,
    Utensils
} from 'lucide-react'

export default function FavoritesPage() {
    return (
        <div className="min-h-screen bg-[#fffcf8] font-outfit pb-24 md:pb-12">
            {/* Header */}
            <div className="bg-[#3d1d11] pt-16 pb-32 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-[#d35400]/20 rounded-full blur-3xl transform rotate-12" />
                </div>

                <div className="container mx-auto px-6 relative z-10 max-w-4xl">
                    <Link href="/profile" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Takaisin</span>
                    </Link>
                    <h1 className="text-4xl font-black text-white mb-3">Suosikkisi</h1>
                    <p className="text-white/60 font-medium">Kaikki rakastamasi herkut yhdessä paikassa</p>
                </div>
            </div>

            <div className="container mx-auto px-6 max-w-4xl -mt-16 relative z-20 space-y-12">
                {/* Empty State */}
                <div className="bg-white rounded-[3rem] p-20 app-shadow border border-[#f1ebd8] text-center">
                    <div className="w-24 h-24 bg-[#fff0f0] rounded-[2.5rem] flex items-center justify-center text-[#e74c3c] mx-auto mb-8 relative">
                        <Heart className="w-10 h-10 fill-current" />
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#3d1d11] rounded-full flex items-center justify-center text-white border-4 border-white">
                            <Star className="w-3 h-3 fill-current" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-black text-[#3d1d11] mb-4">Tyhjää täynnä?</h2>
                    <p className="text-[#a08a7e] font-medium max-w-xs mx-auto mb-10">Et ole vielä tallentanut suosikkeja. Klikkaa sydäntä ravintoloiden kohdalla lisätäksesi ne tähän!</p>

                    <Link href="/">
                        <button className="bg-[#3d1d11] text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-[#d35400] transition-colors shadow-2xl active:scale-95">
                            Löydä Suosikkeja
                        </button>
                    </Link>
                </div>

                {/* Suggestions Section */}
                <section>
                    <div className="flex items-center justify-between mb-8 px-4">
                        <h2 className="text-2xl font-black text-[#3d1d11]">Ehkä tykkäisit näistä?</h2>
                        <Link href="/" className="text-xs font-black text-[#d35400] uppercase tracking-[0.2em] hover:opacity-70 flex items-center gap-2">
                            Katso lisää <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-white rounded-[2.5rem] border border-[#f1ebd8] p-6 app-shadow group cursor-pointer hover:translate-y-[-4px] transition-all">
                                <div className="flex gap-4">
                                    <div className="w-24 h-24 bg-[#fdf2e2] rounded-[1.5rem] flex-shrink-0 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-[#3d1d11]/10 animate-pulse" />
                                        <Utensils className="w-8 h-8 text-[#a08a7e]/30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                    </div>
                                    <div className="flex-1 space-y-2 py-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-black text-[#3d1d11] uppercase text-sm tracking-tight">Malliravintola {i}</h4>
                                            <div className="flex items-center gap-1 text-[#f39c12]">
                                                <Star className="w-3 h-3 fill-current" />
                                                <span className="text-[10px] font-black">4.8</span>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-[#a08a7e] font-medium leading-relaxed">Italialaista • Pizzaa • Pastaa</p>
                                        <div className="flex items-center gap-3 pt-2">
                                            <span className="text-[10px] font-black text-[#27ae60] uppercase tracking-tighter">Säästä 30%</span>
                                            <div className="w-1 h-1 rounded-full bg-[#f1ebd8]" />
                                            <span className="text-[10px] font-medium text-[#a08a7e]">25-35 min</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}
