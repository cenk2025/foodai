import { notFound } from 'next/navigation'
import { DIRECT_ORDERING_ENABLED } from '@/lib/features'

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
    if (!DIRECT_ORDERING_ENABLED) notFound()
    return children
}
