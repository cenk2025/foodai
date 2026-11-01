'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, Star, MapPin, Bike } from 'lucide-react';
import type { DirectRestaurant, MenuItem, DeliveryZone } from '@/lib/direct-ordering/types';
import { useCart, formatEUR } from '@/lib/direct-ordering/CartContext';
import { UBER_EATS_DELIVERY_FEE_CENTS } from '@/lib/direct-ordering/constants';
import { useLanguage } from '@/lib/i18n/context';
import MenuItemCard from './MenuItemCard';
import MenuItemDetailModal from './MenuItemDetailModal';
import CartFab from './CartFab';

type Props = {
    restaurant: DirectRestaurant;
    menuItems: MenuItem[];
    zone: DeliveryZone | null;
};

export default function RestaurantClient({ restaurant, menuItems, zone }: Props) {
    const { t } = useLanguage();
    const { setActiveRestaurantSlug, setMenu } = useCart();
    const [active, setActive] = useState<MenuItem | null>(null);

    useEffect(() => {
        setActiveRestaurantSlug(restaurant.slug);
        setMenu(menuItems);
    }, [restaurant.slug, menuItems, setActiveRestaurantSlug, setMenu]);

    return (
        <div className="min-h-screen bg-page pb-32">
            {/* Cover / hero */}
            <section className="relative h-64 sm:h-80 bg-ink">
                {restaurant.coverUrl && (
                    <Image
                        src={restaurant.coverUrl}
                        alt={restaurant.name}
                        fill
                        priority
                        className="object-cover opacity-70"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />

                <Link
                    href="/"
                    className="absolute top-6 left-6 w-11 h-11 rounded-full bg-white text-ink flex items-center justify-center shadow-lg hover:bg-soft transition-colors"
                    aria-label={t.direct.restaurant.back}
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>

                <div className="absolute bottom-8 left-6 right-6 text-white">
                    <span className="inline-block bg-brand text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.2em] mb-3">
                        {t.direct.homepage_card_badge}
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
                        {restaurant.name}
                    </h1>
                    {restaurant.description && (
                        <p className="mt-2 text-white/80 font-medium max-w-2xl">
                            {restaurant.description}
                        </p>
                    )}
                </div>
            </section>

            {/* Info strip */}
            <section className="max-w-7xl mx-auto px-6 -mt-6 relative z-10">
                <div className="bg-white rounded-[2rem] border border-line app-shadow grid grid-cols-2 sm:grid-cols-4 divide-x divide-line overflow-hidden">
                    <div className="px-5 py-4 flex items-center gap-3">
                        <Star className="w-5 h-5 text-white fill-star" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-subtle">
                                {t.direct.restaurant.rating}
                            </p>
                            <p className="text-sm font-black text-ink">{restaurant.rating}</p>
                        </div>
                    </div>
                    <div className="px-5 py-4 flex items-center gap-3">
                        <Clock className="w-5 h-5 text-brand" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-subtle">
                                {t.direct.restaurant.delivery_time}
                            </p>
                            <p className="text-sm font-black text-ink">
                                {restaurant.etaMin}–{restaurant.etaMax} min
                            </p>
                        </div>
                    </div>
                    <div className="px-5 py-4 flex items-center gap-3">
                        <Bike className="w-5 h-5 text-brand" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-subtle">
                                {t.direct.restaurant.delivery_fee}
                            </p>
                            <p className="text-sm font-black text-ink">
                                {formatEUR(UBER_EATS_DELIVERY_FEE_CENTS)}
                            </p>
                        </div>
                    </div>
                    <div className="px-5 py-4 flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-brand" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-subtle">
                                {t.direct.restaurant.area}
                            </p>
                            <p className="text-sm font-black text-ink truncate">
                                {restaurant.city}
                            </p>
                        </div>
                    </div>
                </div>

                {zone && zone.minOrderCents > 0 && (
                    <p className="text-xs font-bold text-subtle mt-3 px-2">
                        {t.direct.restaurant.min_order}: {formatEUR(zone.minOrderCents)}
                    </p>
                )}
            </section>

            {/* Menu */}
            <section className="max-w-7xl mx-auto px-6 mt-12">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-2 text-brand text-xs font-black uppercase tracking-[0.2em] mb-1">
                            <div className="w-8 h-[2px] bg-brand" />
                            {t.direct.restaurant.menu}
                        </div>
                        <h2 className="text-3xl font-black text-ink tracking-tight">
                            {menuItems.length} {t.direct.restaurant.menu.toLowerCase()}
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {menuItems.map((item) => (
                        <MenuItemCard key={item.id} item={item} onOpen={() => setActive(item)} />
                    ))}
                </div>
            </section>

            <MenuItemDetailModal item={active} onClose={() => setActive(null)} />
            <CartFab />
        </div>
    );
}
