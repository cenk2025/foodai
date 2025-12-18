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
                <nav className="hidden md:flex items-center gap-6">
                    <Link
                        href="/"
                        className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                    >
                        Search
                    </Link>
                    <Link
                        href="/about"
                        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                        About
                    </Link>
                </nav>

                {/* Mobile Menu - Simplified for now */}
                <div className="md:hidden">
                    <Link
                        href="/"
                        className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                    >
                        Search
                    </Link>
                </div>
            </div>
        </header>
    )
}
