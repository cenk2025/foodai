'use client'

import { Bike, ShoppingBag } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'

export type Fulfilment = 'delivery' | 'pickup'

interface FulfilmentToggleProps {
    value: Fulfilment
    onChange: (value: Fulfilment) => void
}

// Delivery and pickup prices are not comparable (pickup has no fee), so offers
// are always compared within one of the two.
export default function FulfilmentToggle({ value, onChange }: FulfilmentToggleProps) {
    const { t } = useLanguage()
    const options = [
        { id: 'delivery' as const, label: t.card.delivery_mode, icon: Bike },
        { id: 'pickup' as const, label: t.card.pickup, icon: ShoppingBag },
    ]

    return (
        <div role="group" aria-label={t.card.fulfilment_label} className="inline-flex flex-shrink-0 rounded-xl bg-[#fdf2e2] p-1">
            {options.map(({ id, label, icon: Icon }) => (
                <button
                    key={id}
                    type="button"
                    onClick={() => onChange(id)}
                    aria-pressed={value === id}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all ${value === id
                        ? 'bg-[#3d1d11] text-white shadow-md'
                        : 'text-[#3d1d11] hover:bg-[#f3d179]'
                        }`}
                >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                </button>
            ))}
        </div>
    )
}
