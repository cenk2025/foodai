'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart, computeUnitPrice, formatEUR } from '@/lib/direct-ordering/CartContext';
import type { CartLine, MenuItem } from '@/lib/direct-ordering/types';
import { useLanguage } from '@/lib/i18n/context';

// Slide-in cart panel (right side on desktop, full-screen on mobile).
// Mounted once at the root layout; reads cart state from CartContext.

export default function CartPanel() {
    const { t } = useLanguage();
    const {
        isCartOpen, closeCart, lines, menuById, updateLineQty, removeLine,
        clearCart, subtotalCents, activeRestaurantSlug,
    } = useCart();

    useEffect(() => {
        if (!isCartOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeCart();
        };
        window.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [isCartOpen, closeCart]);

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={closeCart}
                aria-hidden={!isCartOpen}
                className={`fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
                    isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            />

            {/* Panel */}
            <aside
                role="dialog"
                aria-modal="true"
                aria-label={t.direct.cart.title}
                className={`fixed top-0 right-0 z-[71] h-full w-full sm:max-w-md bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
                    isCartOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Header */}
                <header className="px-6 py-5 border-b border-line flex items-center justify-between">
                    <h2 className="text-xl font-black tracking-tight text-ink">
                        {t.direct.cart.title}
                    </h2>
                    <button
                        type="button"
                        onClick={closeCart}
                        className="w-10 h-10 rounded-full bg-soft text-ink flex items-center justify-center hover:bg-line transition-colors"
                        aria-label={t.direct.cart.close}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </header>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {lines.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-3 text-subtle">
                            <div className="w-20 h-20 rounded-full bg-soft flex items-center justify-center text-3xl">
                                🛒
                            </div>
                            <p className="font-black text-ink">{t.direct.cart.empty}</p>
                            <p className="text-sm font-medium max-w-xs">
                                {t.direct.cart.empty_desc}
                            </p>
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {lines.map((line) => {
                                const item = menuById[line.menuItemId];
                                if (!item) return null;
                                return (
                                    <CartLineRow
                                        key={line.lineId}
                                        line={line}
                                        item={item}
                                        onInc={() => updateLineQty(line.lineId, line.quantity + 1)}
                                        onDec={() => updateLineQty(line.lineId, line.quantity - 1)}
                                        onRemove={() => removeLine(line.lineId)}
                                        deleteLabel={t.direct.admin.delete}
                                    />
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* Footer */}
                {lines.length > 0 && (
                    <footer className="border-t border-line px-6 py-5 space-y-4 bg-white">
                        <div className="space-y-2 text-sm font-bold">
                            <div className="flex justify-between text-ink">
                                <span>{t.direct.cart.subtotal}</span>
                                <span>{formatEUR(subtotalCents)}</span>
                            </div>
                            <div className="flex justify-between text-subtle">
                                <span>{t.direct.cart.delivery_fee}</span>
                                <span>{t.direct.cart.delivery_fee_at_checkout}</span>
                            </div>
                            <div className="flex justify-between text-lg font-black text-ink pt-2 border-t border-line">
                                <span>{t.direct.cart.total}</span>
                                <span>{formatEUR(subtotalCents)}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Link
                                href={
                                    activeRestaurantSlug
                                        ? `/restaurant/${activeRestaurantSlug}/checkout`
                                        : '#'
                                }
                                onClick={closeCart}
                                className="block w-full text-center bg-brand hover:bg-brand-dark text-white rounded-2xl py-4 font-black uppercase text-xs tracking-[0.2em] transition-colors"
                            >
                                {t.direct.cart.go_to_checkout}
                            </Link>
                            <button
                                type="button"
                                onClick={clearCart}
                                className="w-full text-center text-subtle hover:text-brand py-2 font-black uppercase text-[10px] tracking-[0.2em] transition-colors"
                            >
                                {t.direct.cart.clear}
                            </button>
                        </div>
                    </footer>
                )}
            </aside>
        </>
    );
}

function CartLineRow({
    line, item, onInc, onDec, onRemove, deleteLabel,
}: {
    line: CartLine;
    item: MenuItem;
    onInc: () => void;
    onDec: () => void;
    onRemove: () => void;
    deleteLabel: string;
}) {
    const unit = computeUnitPrice(item, line.sizeId, line.selectedOptions);
    const sizeLabel = item.sizes?.find((s) => s.id === line.sizeId)?.label;
    const optionLabels = collectOptionLabels(item, line.selectedOptions);

    return (
        <li className="bg-page border border-line rounded-2xl p-4 space-y-3">
            <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                    <h3 className="font-black text-ink truncate">{item.name}</h3>
                    {sizeLabel && (
                        <p className="text-xs font-bold text-subtle mt-0.5">{sizeLabel}</p>
                    )}
                    {optionLabels.length > 0 && (
                        <ul className="text-xs font-medium text-subtle mt-1 space-y-0.5">
                            {optionLabels.map((l) => (
                                <li key={l} className="truncate">+ {l}</li>
                            ))}
                        </ul>
                    )}
                </div>
                <button
                    type="button"
                    onClick={onRemove}
                    className="w-8 h-8 rounded-full text-subtle hover:text-brand hover:bg-soft flex items-center justify-center transition-colors flex-shrink-0"
                    aria-label={deleteLabel}
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onDec}
                        className="w-8 h-8 rounded-full bg-white border border-line flex items-center justify-center hover:border-brand hover:text-brand transition-colors"
                        aria-label="-"
                    >
                        <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center font-black text-ink">
                        {line.quantity}
                    </span>
                    <button
                        type="button"
                        onClick={onInc}
                        className="w-8 h-8 rounded-full bg-white border border-line flex items-center justify-center hover:border-brand hover:text-brand transition-colors"
                        aria-label="+"
                    >
                        <Plus className="w-3.5 h-3.5" />
                    </button>
                </div>
                <span className="text-sm font-black text-ink">
                    {formatEUR(unit * line.quantity)}
                </span>
            </div>
        </li>
    );
}

function collectOptionLabels(
    item: MenuItem,
    selected: CartLine['selectedOptions'],
): string[] {
    const out: string[] = [];
    for (const sel of selected) {
        const group = item.customizationGroups?.find((g) => g.id === sel.groupId);
        const opt = group?.options.find((o) => o.id === sel.optionId);
        if (group && opt) out.push(opt.label);
    }
    return out;
}
