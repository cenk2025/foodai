'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Utensils, Globe, User, LogOut, Settings } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export default function Header() {
    const { t, locale, setLocale } = useLanguage()
    const router = useRouter()
    const [user, setUser] = useState<SupabaseUser | null>(null)
    const [loading, setLoading] = useState(true)
    const [showDropdown, setShowDropdown] = useState(false)

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
        <header className="sticky top-0 z-50 w-full border-b border-border glass bg-white/80 dark:bg-black/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
                        <Utensils className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold gradient-text">
                        FoodAi
                    </span>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link
                        href="/"
                        className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                    >
                        {t.header.home}
                    </Link>
                    <Link
                        href="/search"
                        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                        {t.header.offers}
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
                                        <button className="text-sm font-medium text-foreground hover:text-primary transition-colors px-4 py-2">
                                            {t.header.signin}
                                        </button>
                                    </Link>
                                    <Link href="/signup">
                                        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-full transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50">
                                            {t.header.get_started}
                                        </button>
                                    </Link>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
