'use client'

import { Compass, Search, ShoppingBag, Heart, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
    const pathname = usePathname()

    const navItems = [
        { icon: Compass, label: 'Löydä', href: '/' },
        { icon: Search, label: 'Haku', href: '/search' },
        { icon: ShoppingBag, label: 'Tilaukset', href: '/orders' },
        { icon: Heart, label: 'Suosikit', href: '/favorites' },
        { icon: User, label: 'Profiili', href: '/profile' },
    ]

    return (
        <div className="bottom-nav md:hidden pb-safe">
            {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`nav-item ${isActive ? 'active' : ''}`}
                    >
                        <item.icon className="w-6 h-6" />
                        <span className="text-[10px] font-bold uppercase tracking-tighter">
                            {item.label}
                        </span>
                    </Link>
                )
            })}
        </div>
    )
}
