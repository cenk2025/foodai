'use client'

import Link from 'next/link'
import { Utensils } from 'lucide-react'

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border glass">
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
                        Home
                    </Link>
                    <Link
                        href="/search"
                        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                        Offers
                    </Link>
                    <Link
                        href="/about"
                        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                        About
                    </Link>
                </nav>

                {/* Auth Actions */}
                <div className="flex items-center gap-3">
                    <Link href="/login" className="hidden md:block">
                        <button className="text-sm font-medium text-foreground hover:text-primary transition-colors px-4 py-2">
                            Sign In
                        </button>
                    </Link>
                    <Link href="/signup">
                        <button className="bg-primary hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-full transition-all shadow-lg shadow-blue-500/20">
                            Get Started
                        </button>
                    </Link>
                </div>
            </div>
        </header>
    )
}
