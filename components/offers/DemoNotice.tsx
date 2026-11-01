'use client'

import { Info } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'

// Shown wherever demo-source offers are on screen, so nobody takes them for real deals.
export default function DemoNotice({ className = '' }: { className?: string }) {
    const { t } = useLanguage()

    return (
        <p role="note" className={`flex items-start gap-2 rounded-2xl border border-line bg-soft px-4 py-3 text-sm font-medium text-ink ${className}`}>
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" />
            {t.card.demo_notice}
        </p>
    )
}
