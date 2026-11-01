'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { MapPin, User, LogOut, Settings, ChevronDown, ChevronRight, LocateFixed, Check } from 'lucide-react'
import { getCities } from '@/app/actions/offers'
import { useLanguage } from '@/lib/i18n/context'
import { useLocation } from '@/lib/context/LocationContext'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export default function Header() {
    const { t, locale, setLocale } = useLanguage()
    const { location, setLocation, city, setCity } = useLocation()
    const router = useRouter()
    const pathname = usePathname()
    const [user, setUser] = useState<SupabaseUser | null>(null)
    const [loading, setLoading] = useState(true)
    const [showDropdown, setShowDropdown] = useState(false)

    useEffect(() => {
        const supabase = createClient()
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })
        return () => subscription.unsubscribe()
    }, [])

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        setShowDropdown(false)
        router.push('/')
        router.refresh()
    }

    const getUserDisplayName = () => {
        if (!user) return ''
        return user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
    }

    // Desktop counterpart of the mobile BottomNav.
    const navLinks = [
        { label: t.header.discover, href: '/' },
        { label: t.header.search, href: '/search' },
        { label: t.header.favorites, href: '/favorites' },
    ]

    const [isDetecting, setIsDetecting] = useState(false)
    const [showCityMenu, setShowCityMenu] = useState(false)
    const [cities, setCities] = useState<Array<{ id: string; name: string }>>([])

    const openCityMenu = () => {
        setShowCityMenu((open) => !open)
        if (cities.length === 0) getCities().then(setCities).catch(() => setCities([]))
    }

    const chooseCity = (name: string) => {
        setCity(name)
        setLocation(name)
        setShowCityMenu(false)
    }

    const detectLocation = () => {
        if (!navigator.geolocation) {
            alert('Selaimesi ei tue sijainnin tunnistusta.')
            return
        }

        setIsDetecting(true)
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords
                try {
                    // Use Server Action for reliable geocoding with User-Agent
                    const { getLocationFromCoords } = await import('@/app/actions/location')
                    const result = await getLocationFromCoords(latitude, longitude)

                    if (result.success) {
                        setLocation(result.location || 'Helsinki')
                        setCity(result.city || 'Helsinki')
                    } else {
                        // Fallback mechanism or alert
                        console.warn('Geocoding failed:', result.error)
                        setLocation('Sijaintia ei löytynyt')
                    }
                } catch (error) {
                    console.error('Location detection error:', error)
                    setLocation('Virhe sijainnissa')
                } finally {
                    setIsDetecting(false)
                }
            },
            (error) => {
                console.error('Geolocation error:', error)
                let errorMsg = 'Virhe sijainnin haussa.'
                if (error.code === error.PERMISSION_DENIED) {
                    errorMsg = 'Sijaintitiedot evätty. Salli sijainti selaimen asetuksista.'
                }
                alert(errorMsg)
                setIsDetecting(false)
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        )
    }

    return (
        <header className="z-50 w-full relative">
            {/* Top Bar: Location & Language (Tier 1) */}
            <div className="location-bar-bg px-4 py-2 flex items-center justify-between text-ink">
                <div className="flex items-center gap-2">
                    <button
                        onClick={detectLocation}
                        className="w-8 h-8 rounded-full bg-ink/10 flex items-center justify-center hover:bg-brand-dark/20 transition-all active:scale-95"
                    >
                        <MapPin className={`w-4 h-4 text-ink ${isDetecting ? 'animate-bounce' : ''}`} />
                    </button>
                    <div className="flex flex-col relative">
                        <span className="text-[10px] uppercase font-bold tracking-tight opacity-60">{t.header.location}</span>
                        <button
                            type="button"
                            onClick={openCityMenu}
                            aria-haspopup="listbox"
                            aria-expanded={showCityMenu}
                            className="flex items-center gap-2 cursor-pointer hover:opacity-70 group transition-all text-left"
                        >
                            <span className="text-xs font-black">{location}</span>
                            <ChevronDown className={`w-3 h-3 transition-transform ${showCityMenu ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} />
                            {isDetecting && (
                                <span className="text-[9px] bg-brand text-white px-1.5 py-0.5 rounded-md animate-pulse">Etsitään...</span>
                            )}
                        </button>

                        {showCityMenu && (
                            <>
                                <div className="fixed inset-0 z-[60]" onClick={() => setShowCityMenu(false)} />
                                <div role="listbox" aria-label="Valitse kaupunki" className="absolute top-full left-0 mt-2 z-[70] w-60 max-h-80 overflow-y-auto bg-white rounded-2xl shadow-2xl border border-line py-2">
                                    <button
                                        type="button"
                                        onClick={() => { setShowCityMenu(false); detectLocation() }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-brand hover:bg-soft/60 transition-colors"
                                    >
                                        <LocateFixed className="w-4 h-4" />
                                        Käytä nykyistä sijaintia
                                    </button>
                                    <div className="h-px bg-line my-1" />
                                    {cities.length === 0 && (
                                        <p className="px-4 py-3 text-xs text-subtle">Ladataan…</p>
                                    )}
                                    {cities.map((c) => (
                                        <button
                                            key={c.id}
                                            type="button"
                                            role="option"
                                            aria-selected={c.name === city}
                                            onClick={() => chooseCity(c.name)}
                                            className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-ink hover:bg-soft/60 transition-colors"
                                        >
                                            {c.name}
                                            {c.name === city && <Check className="w-4 h-4 text-brand" />}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Language Segmented Control */}
                <div className="bg-ink/10 p-1 rounded-xl flex items-center gap-1">
                    <button
                        onClick={() => setLocale('fi')}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${locale === 'fi' ? 'bg-ink text-white shadow-sm' : 'text-ink/60 hover:text-ink'}`}
                    >
                        FI
                    </button>
                    <button
                        onClick={() => setLocale('en')}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${locale === 'en' ? 'bg-ink text-white shadow-sm' : 'text-ink/60 hover:text-ink'}`}
                    >
                        EN
                    </button>
                </div>
            </div>

            {/* Main Header (Tier 2) */}
            <div className="bg-white px-4 h-16 flex items-center justify-between border-b border-line">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="w-10 h-10 rounded-2xl bg-brand flex items-center justify-center shadow-md transform group-hover:rotate-3 transition-transform">
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 5V19M17 19L20 16M17 19L14 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M7 5V19M7 5L4 8M7 5L10 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <span className="text-xl font-black tracking-tight text-ink">
                        Food<span className="text-brand">AI</span>
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            aria-current={pathname === link.href ? 'page' : undefined}
                            className={`text-sm font-bold transition-colors hover:text-brand ${pathname === link.href ? 'text-brand' : 'text-ink'}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* User Profile / Auth */}
                <div className="flex items-center gap-4">
                    {!loading && (
                        <div className="relative">
                            {user ? (
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="w-10 h-10 rounded-2xl bg-soft flex items-center justify-center border border-brand/5 hover:bg-line transition-colors app-shadow"
                                >
                                    <User className="w-5 h-5 text-ink" />
                                </button>
                            ) : (
                                <Link href="/login">
                                    <button className="text-xs font-black text-ink uppercase tracking-wider hover:text-brand transition-colors">
                                        {t.header.signin}
                                    </button>
                                </Link>
                            )}

                            {showDropdown && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-3xl card-shadow border border-line overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                                        <div className="px-5 py-4 border-b border-line bg-soft/30">
                                            <p className="text-sm font-black text-ink">{getUserDisplayName()}</p>
                                            <p className="text-[10px] text-subtle truncate font-medium">{user?.email}</p>
                                        </div>
                                        <div className="p-2">
                                            <Link href="/profile" onClick={() => setShowDropdown(false)} className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold text-ink hover:bg-soft/50 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <User className="w-4 h-4 text-subtle" />
                                                    Profiili
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-subtle/50" />
                                            </Link>
                                            <Link href="/settings" onClick={() => setShowDropdown(false)} className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold text-ink hover:bg-soft/50 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <Settings className="w-4 h-4 text-subtle" />
                                                    Asetukset
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-subtle/50" />
                                            </Link>
                                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-brand hover:bg-brand-dark/5 transition-colors">
                                                <LogOut className="w-4 h-4" />
                                                Kirjaudu ulos
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
