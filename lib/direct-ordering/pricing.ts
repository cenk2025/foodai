// Pure pricing helpers shared by the cart (client) and checkout (server).
// Keep this module free of 'use client' and React so server actions can use it.

import type { MenuItem } from './types';

type SelectedOption = { groupId: string; optionId: string };

/**
 * Stable, deterministic key for a (menuItem, size, options) combination.
 * Two cart adds with the same selections collapse into one line; any change
 * — different size, different topping, etc. — produces a new line.
 */
export function computeLineKey(
    menuItemId: string,
    sizeId: string | undefined,
    selectedOptions: SelectedOption[],
): string {
    const optionPart = [...selectedOptions]
        .map((o) => `${o.groupId}=${o.optionId}`)
        .sort()
        .join(',');
    return `${menuItemId}|${sizeId ?? '-'}|${optionPart}`;
}

/**
 * Per-unit price for a configured item: base/size price + sum of selected
 * option surcharges (with freeQuantity for multi groups).
 *
 * Pricing rules:
 *   - If the item has sizes[], the chosen size's priceCents replaces the
 *     base price. If no size is chosen yet, falls back to item.priceCents.
 *   - For each customization group:
 *       single → the picked option's surcharge is added in full.
 *       multi  → options are charged in selection order, with the first
 *                `freeQuantity` (if any) treated as 0 €.
 */
export function computeUnitPrice(
    item: MenuItem,
    sizeId: string | undefined,
    selectedOptions: SelectedOption[],
): number {
    let total = item.priceCents;
    if (item.sizes && item.sizes.length > 0) {
        const size = item.sizes.find((s) => s.id === sizeId) ?? item.sizes[0];
        total = size.priceCents;
    }

    for (const group of item.customizationGroups ?? []) {
        const picksInGroup = selectedOptions.filter((o) => o.groupId === group.id);
        if (picksInGroup.length === 0) continue;
        const free = group.type === 'multi' ? (group.freeQuantity ?? 0) : 0;
        picksInGroup.forEach((pick, idx) => {
            const opt = group.options.find((o) => o.id === pick.optionId);
            if (!opt) return;
            if (group.type === 'multi' && idx < free) return;
            total += opt.priceCents;
        });
    }
    return total;
}

export function formatEUR(cents: number): string {
    return (cents / 100).toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' });
}
