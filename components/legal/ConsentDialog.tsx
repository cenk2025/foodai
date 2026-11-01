'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/context'
import { isConsentDialogOpen, setConsent, subscribeToConsent } from '@/lib/consent'

const BUTTON_CLASS = 'flex-1 rounded-2xl bg-ink px-3 py-3 text-sm font-black text-white transition-colors hover:bg-brand-dark'

// Sits over the page without blocking it: until a choice is made, the site runs on
// necessary storage only. Both choices are the same size and style on purpose.
export default function ConsentDialog() {
    const { t } = useLanguage()
    const open = useSyncExternalStore(subscribeToConsent, isConsentDialogOpen, () => false)
    const dialogRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (open) dialogRef.current?.focus()
    }, [open])

    if (!open) return null

    const text = t.legal.consent

    return (
        <div
            ref={dialogRef}
            role="dialog"
            aria-labelledby="consent-title"
            aria-describedby="consent-text"
            tabIndex={-1}
            className="fixed inset-x-4 bottom-24 z-[80] max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-[2rem] border border-line bg-white p-6 shadow-2xl outline-none md:inset-x-auto md:bottom-6 md:left-6 md:w-[30rem]"
        >
            <h2 id="consent-title" className="mb-2 text-lg font-black text-ink">{text.title}</h2>
            <div id="consent-text" className="space-y-2 text-sm font-medium leading-relaxed text-subtle">
                <p>{text.necessary}</p>
                <p>{text.statistics}</p>
                <p>{text.clicks}</p>
            </div>
            <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold text-ink">
                <Link href="/privacy" className="underline">{t.footer.links.privacy}</Link>
                <Link href="/terms" className="underline">{t.footer.links.terms}</Link>
                <Link href="/cookies" className="underline">{t.footer.links.cookies}</Link>
            </p>
            {/* Stays in view on short screens, so neither choice needs scrolling to */}
            <div className="sticky -bottom-6 -mx-6 -mb-6 mt-3 flex gap-2 bg-white px-6 py-4">
                <button type="button" onClick={() => setConsent('statistics')} className={BUTTON_CLASS}>{text.accept}</button>
                <button type="button" onClick={() => setConsent('necessary')} className={BUTTON_CLASS}>{text.reject}</button>
            </div>
        </div>
    )
}
