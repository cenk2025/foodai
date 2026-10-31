'use client';

import React, {
    createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import type { CartLine, MenuItem } from './types';
import { computeLineKey, computeUnitPrice } from './pricing';

// Re-exported for client components; server code must import from ./pricing,
// because anything exported from a 'use client' module is a client reference.
export { computeLineKey, computeUnitPrice, formatEUR } from './pricing';

// One cart per restaurant. The active restaurant slug is set by the
// restaurant page; switching to a different restaurant's page leaves the
// previous cart intact in localStorage (Wolt parity).

type CartState = Record<string /* restaurantSlug */, CartLine[]>;

const STORAGE_KEY = 'foodai_direct_carts_v2';   // bumped from v1 — schema changed

type SelectedOption = { groupId: string; optionId: string };

type CartContextValue = {
    /** active restaurant slug (set by the restaurant page) */
    activeRestaurantSlug: string | null;
    setActiveRestaurantSlug: (slug: string | null) => void;

    /** lines for the active restaurant */
    lines: CartLine[];
    itemCount: number;

    /** menu items currently visible — used to resolve names/prices for the cart panel */
    menuById: Record<string, MenuItem>;
    setMenu: (items: MenuItem[]) => void;

    /** Add a configured item (with size + option choices). Same combination collapses into one line. */
    addLine: (input: {
        menuItemId: string;
        quantity?: number;
        sizeId?: string;
        selectedOptions?: SelectedOption[];
    }) => void;
    updateLineQty: (lineId: string, qty: number) => void;
    removeLine: (lineId: string) => void;
    clearCart: () => void;

    /** Money helpers, both in cents. Delivery fee is resolved at checkout, not here. */
    subtotalCents: number;

    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [allCarts, setAllCarts] = useState<CartState>({});
    const [activeRestaurantSlug, setActiveRestaurantSlug] = useState<string | null>(null);
    const [menuById, setMenuById] = useState<Record<string, MenuItem>>({});
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [hydrated, setHydrated] = useState(false);

    // Hydrate from localStorage on mount. This must run after mount to match
    // the server render, so setting state in this effect is intentional.
    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (raw) setAllCarts(JSON.parse(raw));
        } catch {
            /* corrupt storage — ignore, start clean */
        }
        setHydrated(true);
    }, []);
    /* eslint-enable react-hooks/set-state-in-effect */

    // Persist on every change after hydration.
    useEffect(() => {
        if (!hydrated || typeof window === 'undefined') return;
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(allCarts));
        } catch {
            /* storage quota / privacy mode — silent */
        }
    }, [allCarts, hydrated]);

    const lines = useMemo<CartLine[]>(() => {
        if (!activeRestaurantSlug) return [];
        return allCarts[activeRestaurantSlug] ?? [];
    }, [allCarts, activeRestaurantSlug]);

    const setLines = useCallback(
        (updater: (prev: CartLine[]) => CartLine[]) => {
            if (!activeRestaurantSlug) return;
            setAllCarts((prev) => {
                const next = { ...prev };
                const prevLines = prev[activeRestaurantSlug] ?? [];
                const newLines = updater(prevLines);
                if (newLines.length === 0) {
                    delete next[activeRestaurantSlug];
                } else {
                    next[activeRestaurantSlug] = newLines;
                }
                return next;
            });
        },
        [activeRestaurantSlug],
    );

    const addLine = useCallback<CartContextValue['addLine']>(
        ({ menuItemId, quantity = 1, sizeId, selectedOptions = [] }) => {
            const lineId = computeLineKey(menuItemId, sizeId, selectedOptions);
            setLines((prev) => {
                const idx = prev.findIndex((l) => l.lineId === lineId);
                if (idx === -1) {
                    return [...prev, { lineId, menuItemId, quantity, sizeId, selectedOptions }];
                }
                const copy = [...prev];
                copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + quantity };
                return copy;
            });
        },
        [setLines],
    );

    const updateLineQty = useCallback(
        (lineId: string, qty: number) => {
            setLines((prev) => {
                if (qty <= 0) return prev.filter((l) => l.lineId !== lineId);
                return prev.map((l) => (l.lineId === lineId ? { ...l, quantity: qty } : l));
            });
        },
        [setLines],
    );

    const removeLine = useCallback(
        (lineId: string) => {
            setLines((prev) => prev.filter((l) => l.lineId !== lineId));
        },
        [setLines],
    );

    const clearCart = useCallback(() => setLines(() => []), [setLines]);

    const setMenu = useCallback((items: MenuItem[]) => {
        const map: Record<string, MenuItem> = {};
        for (const it of items) map[it.id] = it;
        setMenuById(map);
    }, []);

    const itemCount = useMemo(
        () => lines.reduce((acc, l) => acc + l.quantity, 0),
        [lines],
    );

    const subtotalCents = useMemo(
        () =>
            lines.reduce((acc, l) => {
                const item = menuById[l.menuItemId];
                if (!item) return acc;
                return acc + computeUnitPrice(item, l.sizeId, l.selectedOptions) * l.quantity;
            }, 0),
        [lines, menuById],
    );

    const value: CartContextValue = {
        activeRestaurantSlug,
        setActiveRestaurantSlug,
        lines,
        itemCount,
        menuById,
        setMenu,
        addLine,
        updateLineQty,
        removeLine,
        clearCart,
        subtotalCents,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within a CartProvider');
    return ctx;
}
