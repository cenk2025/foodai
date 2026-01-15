'use client'

import Link from 'next/link'
import { ArrowLeft, Search, Filter, ShoppingBag, TrendingDown, Zap, Shield, Heart, ChevronRight, HelpCircle } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'

export default function HowItWorksPage() {
    const { t } = useLanguage()

    return (
        <div className="min-h-screen bg-[#fffcf8] font-outfit pb-24 md:pb-12">
            {/* Hero Section */}
            <div className="bg-[#3d1d11] pt-24 pb-48 relative overflow-hidden text-center">
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-[#d35400]/20 rounded-full blur-3xl transform rotate-12" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Takaisin</span>
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                        Miten <span className="text-[#f3d179]">säästät</span> FoodAilla?
                    </h1>
                    <p className="text-xl md:text-2xl text-white/60 font-medium max-w-2xl mx-auto leading-relaxed">
                        Kolme helppoa askelta kohti edullisempaa ruokailua.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 max-w-5xl -mt-24 relative z-20 space-y-24">
                {/* Steps Section */}
                <div className="grid grid-cols-1 gap-8">
                    {[
                        { step: '1', title: t.how_it_works.step1_title, desc: t.how_it_works.step1_desc, icon: Search, color: '#f3d179' },
                        { step: '2', title: t.how_it_works.step2_title, desc: t.how_it_works.step2_desc, icon: Filter, color: '#d35400' },
                        { step: '3', title: t.how_it_works.step3_title, desc: t.how_it_works.step3_desc, icon: ShoppingBag, color: '#27ae60' }
                    ].map((s) => (
                        <div key={s.step} className="bg-white rounded-[4rem] p-10 md:p-16 app-shadow border border-[#f1ebd8] flex flex-col md:flex-row items-center gap-12 group hover:translate-y-[-8px] transition-all">
                            <div className="w-24 h-24 bg-[#fff9f0] rounded-[2.5rem] flex items-center justify-center text-[#d35400] shadow-xl relative flex-shrink-0 group-hover:scale-110 transition-transform">
                                <span className="absolute -top-4 -right-4 w-10 h-10 bg-[#3d1d11] text-white rounded-full flex items-center justify-center font-black border-4 border-white">{s.step}</span>
                                <s.icon className="w-10 h-10" />
                            </div>
                            <div className="flex-1 text-center md:text-left space-y-4">
                                <h3 className="text-2xl font-black text-[#3d1d11] uppercase tracking-widest">{s.title}</h3>
                                <p className="text-lg text-[#a08a7e] font-medium leading-relaxed">{s.desc}</p>
                            </div>
                            <ChevronRight className="hidden md:block w-8 h-8 text-[#f1ebd8] group-hover:text-[#d35400] group-hover:translate-x-4 transition-all" />
                        </div>
                    ))}
                </div>

                {/* FAQ Section */}
                <section className="space-y-12">
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 bg-[#fdf2e2] px-4 py-2 rounded-full">
                            <HelpCircle className="w-4 h-4 text-[#d35400]" />
                            <span className="text-[11px] font-black uppercase tracking-widest text-[#3d1d11]">Usein kysytyt</span>
                        </div>
                        <h2 className="text-4xl font-black text-[#3d1d11] tracking-tight">Kysymyksiä ja vastauksia</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { q: t.how_it_works.faq1_q, a: t.how_it_works.faq1_a },
                            { q: t.how_it_works.faq2_q, a: t.how_it_works.faq2_a },
                            { q: t.how_it_works.faq3_q, a: t.how_it_works.faq3_a },
                            { q: t.how_it_works.faq4_q, a: t.how_it_works.faq4_a }
                        ].map((faq, i) => (
                            <div key={i} className="bg-white p-10 rounded-[3rem] border border-[#f1ebd8] app-shadow hover:bg-[#fff9f0]/50 transition-colors">
                                <h4 className="text-lg font-black text-[#3d1d11] mb-4 leading-tight">{faq.q}</h4>
                                <p className="text-sm text-[#a08a7e] font-medium leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA Card */}
                <div className="bg-[#3d1d11] rounded-[4rem] p-12 md:p-20 text-white text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#d35400]/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-1000" />
                    <div className="relative z-10 max-w-2xl mx-auto space-y-10">
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">{t.how_it_works.cta_title}</h2>
                        <p className="text-xl text-white/60 font-medium">{t.how_it_works.cta_subtitle}</p>
                        <Link href="/">
                            <button className="bg-[#f3d179] text-[#3d1d11] px-12 py-6 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-white hover:scale-105 transition-all active:scale-95">
                                {t.how_it_works.cta_button}
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
