import OfferCard from './OfferCard'
import { MealComparison } from '@/lib/offers/compare'

const MIN_ITEMS = 3

interface OfferShelfProps {
    title: string
    comparisons: MealComparison[]
}

// A sideways-scrolling row of deals; too few to be worth a row means no row.
export default function OfferShelf({ title, comparisons }: OfferShelfProps) {
    if (comparisons.length < MIN_ITEMS) return null

    return (
        <section aria-label={title}>
            <h2 className="mb-4 text-2xl font-black tracking-tight text-[#3d1d11]">{title}</h2>
            <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 no-scrollbar">
                {comparisons.map(({ best, others }) => (
                    <div key={best.id} className="w-[270px] flex-shrink-0 snap-start">
                        <OfferCard offer={best} others={others} />
                    </div>
                ))}
            </div>
        </section>
    )
}
