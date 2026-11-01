'use client'

import { useEffect, useRef } from 'react'
import { getConsent, subscribeToConsent } from '@/lib/consent'

const FLUSH_DELAY_MS = 2000
const MAX_BATCH = 50

// Each offer counts once per page load; visible offers are sent in small batches.
const seen = new Set<string>()
let queue: string[] = []
let timer: ReturnType<typeof setTimeout> | null = null

function flush() {
    if (timer) clearTimeout(timer)
    timer = null
    // Offers wait here until the visitor chooses; nothing is sent without their permission.
    if (queue.length === 0 || getConsent() !== 'statistics') return
    const ids = queue.slice(0, MAX_BATCH)
    queue = queue.slice(MAX_BATCH)
    fetch('/api/track/views', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
        keepalive: true,
    }).catch(() => {})
    if (queue.length > 0) timer = setTimeout(flush, FLUSH_DELAY_MS)
}

function report(offerId: string) {
    if (seen.has(offerId)) return
    seen.add(offerId)
    queue.push(offerId)
    if (!timer) timer = setTimeout(flush, FLUSH_DELAY_MS)
}

if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') flush()
    })
    subscribeToConsent(() => {
        const consent = getConsent()
        if (consent === 'statistics') flush()
        if (consent === 'necessary') queue = []
    })
}

// Invisible and out of the layout flow; put it inside whatever shows the offer.
export default function OfferViewMarker({ offerId, isDemo }: { offerId: string; isDemo: boolean }) {
    const ref = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        const element = ref.current
        // Example data has no partner to report on
        if (isDemo || !element || typeof IntersectionObserver === 'undefined') return
        const observer = new IntersectionObserver((entries) => {
            if (entries.some(entry => entry.isIntersecting)) {
                report(offerId)
                observer.disconnect()
            }
        })
        observer.observe(element)
        return () => observer.disconnect()
    }, [offerId, isDemo])

    return <span ref={ref} aria-hidden="true" className="pointer-events-none absolute h-px w-px" />
}
