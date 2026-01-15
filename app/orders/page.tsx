'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
    ArrowLeft,
    ShoppingBag,
    Clock,
    ChevronRight,
    Utensils,
    Receipt,
    Star
} from 'lucide-react'

export default function OrdersPage() {
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
                    <h1 className="text-4xl font-black text-white mb-3">Tilauksesi</h1>
                    <p className="text-white/60 font-medium">Seuraa tilauksiasi ja katso historiaa</p>
                </div>
            </div>

            <div className="container mx-auto px-6 max-w-4xl -mt-16 relative z-20 space-y-8">
                {/* Order Tabs */}
                <div className="flex gap-4 p-2 bg-white rounded-[2rem] app-shadow border border-[#f1ebd8] mb-8">
                    <button className="flex-1 py-4 rounded-3xl bg-[#3d1d11] text-white text-xs font-black uppercase tracking-widest shadow-lg">Aktiiviset (0)</button>
                    <button className="flex-1 py-4 rounded-3xl text-[#a08a7e] hover:bg-[#fdf2e2]/50 text-xs font-black uppercase tracking-widest transition-all">Historia (0)</button>
                </div>

                {/* Empty State */}
                <div className="bg-white rounded-[3rem] p-20 app-shadow border border-[#f1ebd8] text-center">
                    <div className="w-24 h-24 bg-[#fff9f0] rounded-[2.5rem] flex items-center justify-center text-[#d35400] mx-auto mb-8 animate-bounce">
                        <ShoppingBag className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-black text-[#3d1d11] mb-4">Nälkä yllätti?</h2>
                    <p className="text-[#a08a7e] font-medium max-w-xs mx-auto mb-10">Sinulla ei ole vielä aktiivisia tilauksia. Tee ensimmäinen tilauksesi ja ala nauttimaan!</p>

                    <Link href="/">
                        <button className="bg-[#3d1d11] text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-[#d35400] transition-colors shadow-2xl active:scale-95">
                            Selaa ravintoloita
                        </button>
                    </Link>
                </div>

                {/* Promo Card */}
                <div className="bg-gradient-to-br from-[#f3d179] to-[#d35400] rounded-[3rem] p-10 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-1000" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left">
                            <h3 className="text-2xl font-black mb-2">Anna palautetta!</h3>
                            <p className="font-medium text-white/80">Kerro meille miten onnistuimme ja saat yllätyksen seuraavaan tilaukseen.</p>
                        </div>
                        <button className="bg-[#3d1d11] text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:scale-105 transition-transform active:scale-95">
                            Anna Palaute
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
