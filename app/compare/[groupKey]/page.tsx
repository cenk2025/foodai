import Link from 'next/link'
import { ArrowLeft, TrendingDown } from 'lucide-react'
import { getOffersByGroupKey } from '@/app/actions/offers'
import OfferCard from '@/components/offers/OfferCard'
import Button from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'

interface PageProps {
    params: Promise<{
        groupKey: string
    }>
}

export default async function ComparePage({ params }: PageProps) {
    const { groupKey } = await params
    const offers = await getOffersByGroupKey(groupKey)

    if (offers.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-12">
                    <Link href="/">
                        <Button variant="ghost">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Search
                        </Button>
                    </Link>
                    <div className="mt-12 text-center">
                        <h1 className="text-2xl font-bold mb-4">No Offers Found</h1>
                        <p className="text-muted-foreground">
                            We couldn't find any offers to compare.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    const cheapestOffer = offers[0]
    const mostExpensiveOffer = offers[offers.length - 1]
    const savings = mostExpensiveOffer.price_cents - cheapestOffer.price_cents

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <Link href="/">
                    <Button variant="ghost" className="mb-6">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Search
                    </Button>
                </Link>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        Compare Prices
                    </h1>
                    <p className="text-lg text-muted-foreground mb-4">
                        {cheapestOffer.meal.name} at {cheapestOffer.meal.restaurant.name}
                    </p>

                    {/* Savings Banner */}
                    {savings > 0 && (
                        <div className="glass rounded-xl p-4 inline-flex items-center gap-3">
                            <TrendingDown className="w-6 h-6 text-accent" />
                            <div>
                                <p className="text-sm text-muted-foreground">Save up to</p>
                                <p className="text-2xl font-bold text-accent">
                                    {formatPrice(savings)}
                                </p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                by choosing the cheapest option
                            </p>
                        </div>
                    )}
                </div>

                {/* Offers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {offers.map((offer, index) => (
                        <div key={offer.id} className="relative">
                            {index === 0 && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                                    <span className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                                        Best Deal
                                    </span>
                                </div>
                            )}
                            <OfferCard offer={offer} />
                        </div>
                    ))}
                </div>

                {/* Info */}
                <div className="mt-12 glass rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4">About Price Comparison</h2>
                    <p className="text-muted-foreground">
                        We compare prices from multiple sources to help you find the best deals.
                        Prices may vary based on delivery fees, promotions, and availability.
                        Click "Go to Deal" to be redirected to the source platform.
                    </p>
                </div>
            </div>
        </div>
    )
}
