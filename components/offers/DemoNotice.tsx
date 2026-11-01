'use client'

import { Info } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'

// Shown wherever demo-source offers are on screen, so nobody takes them for real deals.
export default function DemoNotice({ className = '' }: { className?: string }) {
    const { t } = useLanguage()

    return (
        <p role="note" className={`flex items-start gap-2 rounded-2xl border border-[#f3d179] bg-[#fdf2e2] px-4 py-3 text-sm font-medium text-[#3d1d11] ${className}`}>
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#d35400]" />
            {t.card.demo_notice}
        </p>
    )
}
