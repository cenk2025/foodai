'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Pencil } from 'lucide-react';
import type { DirectRestaurant } from '@/lib/direct-ordering/types';
import RestaurantFormModal from '../RestaurantFormModal';

// Restaurant detail page header — name + slug, "Open public page" link,
// and an "Edit restaurant" button that reuses the same modal as create.

export default function RestaurantHeader({ restaurant }: { restaurant: DirectRestaurant }) {
    const [editing, setEditing] = useState(false);

    return (
        <header className="mt-3 mb-10 flex items-end justify-between gap-6 flex-wrap">
            <div>
                <h1 className="text-3xl font-black text-ink tracking-tight">
                    {restaurant.name}
                </h1>
                <p className="text-subtle font-medium">
                    {restaurant.city} · /{restaurant.slug}
                    {!restaurant.isActive && (
                        <span className="ml-2 inline-block bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg">
                            Hidden
                        </span>
                    )}
                </p>
            </div>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] bg-white border border-line text-ink hover:border-brand/40 px-4 py-3 rounded-xl transition-colors"
                >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit restaurant
                </button>
                <Link
                    href={`/restaurant/${restaurant.slug}`}
                    target="_blank"
                    className="text-xs font-black uppercase tracking-[0.2em] bg-soft text-ink hover:bg-line px-4 py-3 rounded-xl transition-colors"
                >
                    Open public page ↗
                </Link>
            </div>

            <RestaurantFormModal
                open={editing}
                onClose={() => setEditing(false)}
                initial={restaurant}
            />
        </header>
    );
}
