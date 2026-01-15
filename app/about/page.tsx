'use client'

import Link from 'next/link'
import { ArrowLeft, Target, TrendingDown, Shield, Zap, Utensils, Heart, ShoppingBag } from 'lucide-react'

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#fffcf8] font-outfit pb-24 md:pb-12">
            {/* Hero Section */}
            <div className="bg-[#3d1d11] pt-24 pb-48 relative overflow-hidden text-center">
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-[#d35400]/20 rounded-full blur-3xl transform rotate-12" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[150%] bg-[#f3d179]/10 rounded-full blur-3xl transform -rotate-12" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Takaisin</span>
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                        Tietoa <span className="text-[#f3d179]">FoodAista</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-white/60 font-medium max-w-2xl mx-auto leading-relaxed">
                        Älykäs kumppanisi parhaiden ruokatarjousten löytämiseen Suomessa.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 max-w-5xl -mt-24 relative z-20 space-y-24">
                {/* Mission Card */}
                <div className="bg-white rounded-[4rem] p-12 md:p-20 app-shadow border border-[#f1ebd8] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#fdf2e2] rounded-full blur-3xl -mr-32 -mt-32 opacity-50 group-hover:scale-150 transition-transform duration-1000" />
                    <div className="relative z-10 text-center max-w-3xl mx-auto">
                        <div className="w-20 h-20 bg-[#fff9f0] rounded-[2rem] flex items-center justify-center text-[#d35400] mx-auto mb-10 shadow-lg">
                            <Target className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-black text-[#3d1d11] mb-8 uppercase tracking-widest">Meidän Missio</h2>
                        <p className="text-lg md:text-xl text-[#a08a7e] font-medium leading-[1.8] italic">
                            &quot;FoodAi on hintavertailualusta, joka on suunniteltu auttamaan sinua säästämään rahaa ruokatilauksissasi. Teemme halvimpien aterioiden löytämisestä helppoa useiden eri toimitusalustojen ja ravintoloiden välillä.&quot;
                        </p>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="space-y-12">
                    <h2 className="text-4xl font-black text-[#3d1d11] text-center tracking-tight">Miksi valita FoodAi?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: 'Säästä Rahaa', icon: TrendingDown, color: '#f3d179', desc: 'Vertaa hintoja ja säästä jopa 30% jokaisesta tilauksesta' },
                            { title: 'Nopea Haku', icon: Zap, color: '#d35400', desc: 'Löydä parhaat diilit sekunneissa älykkäillä suodattimilla' },
                            { title: 'Personoitu', icon: Heart, color: '#e74c3c', desc: 'Suodata ruokavaliosi, hintaluokan ja toimitustavan mukaan' },
                            { title: 'Läpinäkyvä', icon: Shield, color: '#27ae60', desc: 'Ei piilokuluja. Näe todelliset hinnat toimituskuluineen' }
                        ].map((f) => (
                            <div key={f.title} className="bg-white p-10 rounded-[3rem] border border-[#f1ebd8] app-shadow hover:translate-y-[-8px] transition-all group">
                                <div className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-all" style={{ backgroundColor: `${f.color}15`, color: f.color }}>
                                    <f.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-black text-[#3d1d11] mb-4 uppercase tracking-wider">{f.title}</h3>
                                <p className="text-sm text-[#a08a7e] font-medium leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* How it works simple steps */}
                <div className="bg-[#3d1d11] rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#d35400]/10 blur-3xl rounded-full" />
                    <h2 className="text-4xl font-black mb-20 text-center tracking-tight">Miten se toimii?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 relative z-10">
                        {[
                            { step: '1', title: 'Etsi', desc: 'Kirjoita mitä haluat syödä ja valitse kaupunki.' },
                            { step: '2', title: 'Vertaa', desc: 'Näytämme saman annoksen hinnan eri alustoilla.' },
                            { step: '3', title: 'Säästä', desc: 'Klikkaa halvinta diiliä ja nauti ateriastasi.' }
                        ].map((s) => (
                            <div key={s.step} className="text-center space-y-6">
                                <div className="w-16 h-16 bg-[#f3d179] text-[#3d1d11] rounded-2xl flex items-center justify-center text-2xl font-black mx-auto shadow-xl transform group-hover:rotate-6 transition-transform">
                                    {s.step}
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-widest">{s.title}</h3>
                                <p className="text-white/60 font-medium leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Demo Notice */}
                <div className="bg-[#fdf2e2]/50 rounded-[3rem] p-10 border-2 border-dashed border-[#f1ebd8] text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Utensils className="w-5 h-5 text-[#3d1d11]" />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#3d1d11]">Demo-versio</span>
                    </div>
                    <p className="text-sm text-[#a08a7e] font-medium max-w-2xl mx-auto leading-relaxed">
                        Tämä on FoodAin esittelyversio. Kaikki hinnat, ravintolat ja tarjoukset ovat vain esittelytarkoituksiin.
                        Tuotantoversiossa integroimme viralliset API-rajapinnat ja kumppanuusohjelmat.
                    </p>
                    <div className="mt-8 pt-8 border-t border-[#f1ebd8] flex flex-wrap justify-center gap-6">
                        {['Next.js 15', 'TypeScript', 'Supabase', 'Tailwind v4'].map(tag => (
                            <span key={tag} className="text-[10px] font-black uppercase tracking-tighter text-[#3d1d11]/40">{tag}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
