import { notFound } from 'next/navigation'
import { DIRECT_ORDERING_ENABLED } from '@/lib/features'

// Covers the restaurant page, checkout and checkout success.
export default function DirectOrderingLayout({ children }: { children: React.ReactNode }) {
    if (!DIRECT_ORDERING_ENABLED) notFound()
    return children
}
