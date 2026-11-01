'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DIRECT_ORDERING_ENABLED } from '@/lib/features'
import {
    ArrowLeft,
    User as UserIcon,
    Mail,
    Calendar,
    MapPin,
    Heart,
    Clock,
    TrendingDown,
    ChevronRight,
    Settings,
    LogOut,
    Utensils,
    Star,
    Bell,
    Wallet
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export default function ProfilePage() {
    const router = useRouter()
    const [user, setUser] = useState<SupabaseUser | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const supabase = createClient()

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                router.push('/login')
                return
            }
            setUser(session.user)
            setLoading(false)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                router.push('/login')
                return
            }
            setUser(session.user)
        })

        return () => subscription.unsubscribe()
    }, [router])

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    const getUserDisplayName = () => {
        if (!user) return ''
        return user.user_metadata?.full_name ||
            user.user_metadata?.first_name ||
            user.email?.split('@')[0] ||
            'Käyttäjä'
    }

    const getUserInitials = () => {
        const name = getUserDisplayName()
        return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    }

    const getJoinDate = () => {
        if (!user?.created_at) return 'N/A'
        return new Date(user.created_at).toLocaleDateString('fi-FI', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-page flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-brand/20 border-t-brand rounded-full animate-spin"></div>
            </div>
        )
    }

    if (!user) return null

    return (
        <div className="min-h-screen bg-page font-outfit pb-24 md:pb-12">
            {/* Header / Cover */}
            <div className="h-48 bg-brand relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-brand/20 rounded-full blur-3xl transform rotate-12" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[150%] bg-brand/10 rounded-full blur-3xl transform -rotate-12" />
                </div>
                <div className="container mx-auto px-6 h-full flex items-end pb-8 relative z-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-auto pt-8">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-widest">Takaisin kauppaan</span>
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-6 max-w-6xl -mt-16 relative z-20">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Sidebar: Profile Card */}
                    <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
                        <div className="bg-white rounded-[3rem] p-8 app-shadow border border-line text-center">
                            <div className="relative inline-block mb-6">
                                <div className="w-32 h-32 bg-gradient-to-br from-brand to-brand rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl border-4 border-white">
                                    {getUserInitials()}
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand rounded-2xl flex items-center justify-center text-white border-4 border-white shadow-lg cursor-pointer hover:bg-brand-dark transition-colors">
                                    <Bell className="w-4 h-4" />
                                </div>
                            </div>

                            <h1 className="text-2xl font-black text-ink mb-1">{getUserDisplayName()}</h1>
                            <p className="text-sm text-subtle font-medium mb-6">{user.email}</p>

                            <div className="pt-6 border-t border-line grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <span className="block text-xl font-black text-brand">0</span>
                                    <span className="text-[10px] font-black text-subtle uppercase tracking-widest">Tilaukset</span>
                                </div>
                                <div className="text-center border-l border-line">
                                    <span className="block text-xl font-black text-save">€0.00</span>
                                    <span className="text-[10px] font-black text-subtle uppercase tracking-widest">Säästetty</span>
                                </div>
                            </div>

                            <div className="mt-8 space-y-2">
                                <Link href="/settings" className="flex items-center justify-between w-full bg-soft/50 hover:bg-soft p-4 rounded-2xl transition-all group">
                                    <div className="flex items-center gap-3">
                                        <Settings className="w-4 h-4 text-ink" />
                                        <span className="text-xs font-black text-ink uppercase tracking-wider">Asetukset</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-subtle/50 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <button onClick={handleLogout} className="flex items-center justify-between w-full bg-brand/5 hover:bg-brand-dark/10 p-4 rounded-2xl transition-all group">
                                    <div className="flex items-center gap-3">
                                        <LogOut className="w-4 h-4 text-brand" />
                                        <span className="text-xs font-black text-brand uppercase tracking-wider">Kirjaudu ulos</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Quick Stats / Achievements */}
                        <div className="bg-ink rounded-[3rem] p-8 text-white card-shadow relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/20 blur-3xl -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-1000" />
                            <h3 className="text-lg font-black mb-6 flex items-center gap-3 relative z-10">
                                <div className="bg-brand p-1.5 rounded-lg text-white">
                                    <Star className="w-4 h-4 fill-current" />
                                </div>
                                Taso 1: Säästäjä
                            </h3>
                            <div className="space-y-4 relative z-10">
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className="w-[10%] h-full bg-brand-light rounded-full" />
                                </div>
                                <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.15em]">Seuraava taso: 5 tilausta</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Content: Dashboard Main */}
                    <div className="flex-1 space-y-8">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-[2.5rem] border border-line app-shadow hover:translate-y-[-4px] transition-all">
                                <div className="w-12 h-12 bg-soft rounded-2xl flex items-center justify-center text-brand mb-4">
                                    <Wallet className="w-6 h-6" />
                                </div>
                                <h4 className="text-sm font-black text-ink uppercase tracking-widest mb-1">Saldo</h4>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-black text-ink">€0.00</span>
                                    <span className="text-[10px] font-bold text-save uppercase tracking-tighter cursor-pointer hover:underline">+ Lisää rahaa</span>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-[2.5rem] border border-line app-shadow hover:translate-y-[-4px] transition-all">
                                <div className="w-12 h-12 bg-[#eff6ff] rounded-2xl flex items-center justify-center text-[#3b82f6] mb-4">
                                    <Heart className="w-6 h-6" />
                                </div>
                                <h4 className="text-sm font-black text-ink uppercase tracking-widest mb-1">Suosikit</h4>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-black text-ink">0</span>
                                    <span className="text-[10px] font-bold text-subtle uppercase tracking-tighter">Tallennettua</span>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-[2.5rem] border border-line app-shadow hover:translate-y-[-4px] transition-all">
                                <div className="w-12 h-12 bg-brand-soft rounded-2xl flex items-center justify-center text-brand mb-4">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <h4 className="text-sm font-black text-ink uppercase tracking-widest mb-1">Viimeksi</h4>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-black text-ink">0</span>
                                    <span className="text-[10px] font-bold text-subtle uppercase tracking-tighter">Hakua tehty</span>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Sections */}
                        <div className="space-y-12">
                            {DIRECT_ORDERING_ENABLED && (
                                <section>
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-2xl font-black text-ink">Viimeisimmät tilaukset</h2>
                                        <Link href="/orders" className="text-xs font-black text-brand uppercase tracking-[0.2em] hover:opacity-70">Katso kaikki</Link>
                                    </div>
                                    <div className="bg-white rounded-[3rem] p-12 border border-line app-shadow text-center">
                                        <div className="w-20 h-20 bg-soft/50 rounded-[2rem] flex items-center justify-center text-subtle/30 mx-auto mb-6">
                                            <Utensils className="w-10 h-10" />
                                        </div>
                                        <h3 className="text-xl font-black text-ink mb-2 tracking-tight">Ei tilauksia vielä</h3>
                                        <p className="text-sm text-subtle font-medium mb-8 max-w-xs mx-auto">Tilaa herkkusi FoodAi:n kautta ja ala kerryttämään säästöjäsi ja historiaasi!</p>
                                        <Link href="/">
                                            <button className="bg-brand text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-brand-dark transition-colors shadow-xl">
                                                Aloita säästäminen
                                            </button>
                                        </Link>
                                    </div>
                                </section>
                            )}

                            <section>
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-black text-ink">Tallennetut sijainnit</h2>
                                    <button className="text-xs font-black text-brand uppercase tracking-[0.2em] hover:opacity-70">+ Lisää uusi</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-soft/30 rounded-[2.5rem] p-8 border border-dashed border-line flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-soft/50 transition-all">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-subtle/50 mb-4 app-shadow group-hover:scale-110 transition-transform">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <p className="text-sm font-black text-ink uppercase tracking-widest">Koti / Työ</p>
                                        <p className="text-[10px] text-subtle font-medium mt-1">Etsi ja tallenna osoitteesi</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
