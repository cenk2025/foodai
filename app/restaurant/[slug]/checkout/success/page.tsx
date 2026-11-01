import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getRestaurantBySlug, getOrder } from '@/lib/direct-ordering/repository';
import { formatEUR } from '@/lib/direct-ordering/pricing';

type Params = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ order?: string; simulated?: string; checkout_id?: string }>;
};

export default async function CheckoutSuccessPage({ params, searchParams }: Params) {
    const { slug } = await params;
    const { order: orderId, simulated } = await searchParams;
    const restaurant = await getRestaurantBySlug(slug);
    if (!restaurant) notFound();

    const order = orderId ? await getOrder(orderId) : null;

    return (
        <div className="min-h-screen bg-page px-6 py-16">
            <div className="max-w-2xl mx-auto bg-white rounded-[2.5rem] border border-line app-shadow p-10 sm:p-14 text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-black tracking-tight text-ink">
                        Thanks — your order is on the way!
                    </h1>
                    <p className="text-subtle font-medium">
                        {restaurant.name} just received your order. You will get an SMS
                        confirmation shortly.
                    </p>
                </div>

                {order && (
                    <div className="bg-soft/60 rounded-2xl p-6 text-left text-sm font-bold text-ink space-y-2">
                        <div className="flex justify-between">
                            <span>Order ID</span>
                            <span className="font-mono">{order.id.slice(0, 12)}…</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Total</span>
                            <span>{formatEUR(order.totalCents)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Payment</span>
                            <span>
                                {order.paymentProvider ?? '—'} ({order.paymentStatus})
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Delivery</span>
                            <span>{order.deliveryProvider ?? '—'}</span>
                        </div>
                    </div>
                )}

                {simulated === '1' && (
                    <p className="text-xs font-bold text-subtle bg-soft rounded-xl px-4 py-3">
                        DEMO: payment was simulated. No real card was charged and Shopify is
                        not yet connected.
                    </p>
                )}

                <div className="flex gap-3 justify-center">
                    <Link
                        href={`/restaurant/${slug}`}
                        className="text-xs font-black uppercase tracking-[0.2em] text-subtle hover:text-brand transition-colors py-3"
                    >
                        Back to menu
                    </Link>
                    <Link
                        href="/"
                        className="bg-brand hover:bg-brand-dark text-white rounded-2xl px-6 py-3 font-black uppercase text-xs tracking-[0.2em] transition-colors"
                    >
                        Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export const metadata = { title: 'Order placed' };
