'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Utensils, Globe, User, LogOut, Settings, Menu, X } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export default function Header() {
    const { t, locale, setLocale } = useLanguage()
    const router = useRouter()
    const [user, setUser] = useState<SupabaseUser | null>(null)
    const [loading, setLoading] = useState(true)
    const [showDropdown, setShowDropdown] = useState(false)
    const [showMobileMenu, setShowMobileMenu] = useState(false)

    useEffect(() => {
        const supabase = createClient()

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // Listen for auth changes
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
        return user.user_metadata?.full_name ||
            user.user_metadata?.first_name ||
            user.email?.split('@')[0] ||
            'User'
    }

    const getUserInitials = () => {
        const name = getUserDisplayName()
        return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
                        style={{
                            background: 'linear-gradient(to bottom right, #ff6b35, #ff4757)',
                        }}
                    >
                        <Utensils className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold gradient-text">
                        FoodAi
                    </span>
                </Link>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                    aria-label="Toggle menu"
                >
                    {showMobileMenu ? (
                        <X className="w-6 h-6 text-gray-900 dark:text-white" />
                    ) : (
                        <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
                    )}
                </button>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link
                        href="/"
                        className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                    >
                        {t.header.home}
                    </Link>
                    <Link
                        href="/how-it-works"
                        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                        {t.header.how_it_works}
                    </Link>
                    <Link
                        href="/about"
                        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                        {t.header.about}
                    </Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {/* Language Switcher */}
                    <button
                        onClick={() => setLocale(locale === 'fi' ? 'en' : 'fi')}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1 text-sm font-medium"
                        title="Switch Language"
                    >
                        <Globe className="w-4 h-4" />
                        <span>{locale.toUpperCase()}</span>
                    </button>

                    {!loading && (
                        <>
                            {user ? (
                                /* Logged in - Show user menu */
                                <div className="relative">
                                    <button
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                            {getUserInitials()}
                                        </div>
                                        <span className="hidden md:block text-sm font-medium text-foreground">
                                            {getUserDisplayName()}
                                        </span>
                                    </button>

                                    {showDropdown && (
                                        <>
                                            {/* Backdrop to close dropdown */}
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setShowDropdown(false)}
                                            />

                                            {/* Dropdown menu */}
                                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-800 py-2 z-50">
                                                <div className="px-4 py-2 border-b border-gray-200 dark:border-zinc-800">
                                                    <p className="text-sm font-medium text-foreground">{getUserDisplayName()}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                                </div>

                                                <Link
                                                    href="/profile"
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                                                    onClick={() => setShowDropdown(false)}
                                                >
                                                    <User className="w-4 h-4" />
                                                    Profile
                                                </Link>

                                                <Link
                                                    href="/settings"
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                                                    onClick={() => setShowDropdown(false)}
                                                >
                                                    <Settings className="w-4 h-4" />
                                                    Settings
                                                </Link>

                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Logout
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                /* Logged out - Show login/signup buttons */
                                <>
                                    <Link href="/login" className="hidden md:block">
                                        <button className="text-sm font-medium text-foreground hover:text-food-orange transition-colors px-4 py-2">
                                            {t.header.signin}
                                        </button>
                                    </Link>
                                    <Link href="/signup">
                                        <button
                                            className="text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all shadow-lg hover:scale-105 active:scale-95"
                                            style={{
                                                background: 'linear-gradient(to right, #ff6b35, #ff4757)',
                                            }}
                                        >
                                            {t.header.get_started}
                                        </button>
                                    </Link>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {showMobileMenu && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setShowMobileMenu(false)}
                    />

                    {/* Menu Panel */}
                    <div className="fixed top-16 left-0 right-0 bg-white dark:bg-zinc-900 border-b border-border z-50 md:hidden">
                        <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
                            <Link
                                href="/"
                                className="text-base font-medium text-foreground hover:text-primary transition-colors py-2"
                                onClick={() => setShowMobileMenu(false)}
                            >
                                {t.header.home}
                            </Link>
                            <Link
                                href="/how-it-works"
                                className="text-base font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                                onClick={() => setShowMobileMenu(false)}
                            >
                                {t.header.how_it_works}
                            </Link>
                            <Link
                                href="/about"
                                className="text-base font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                                onClick={() => setShowMobileMenu(false)}
                            >
                                {t.header.about}
                            </Link>

                            {!loading && !user && (
                                <div className="flex flex-col gap-3 pt-4 border-t border-border">
                                    <Link href="/login" onClick={() => setShowMobileMenu(false)}>
                                        <button className="w-full text-base font-medium text-foreground hover:text-food-orange transition-colors px-4 py-3 border border-border rounded-lg">
                                            {t.header.signin}
                                        </button>
                                    </Link>
                                    <Link href="/signup" onClick={() => setShowMobileMenu(false)}>
                                        <button
                                            className="w-full text-white text-base font-semibold px-4 py-3 rounded-lg transition-all shadow-lg"
                                            style={{
                                                background: 'linear-gradient(to right, #ff6b35, #ff4757)',
                                            }}
                                        >
                                            {t.header.get_started}
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </nav>
                    </div>
                </>
            )}
        </header>
    )
}
