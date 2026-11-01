'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/lib/i18n/context'
import { openConsentSettings } from '@/lib/consent'
import { COMPANY_NAME, SITE_NAME } from '@/lib/seo'

// The provider's details must stay within easy reach on every page; the home page has them in its footer.
export default function LegalLinks() {
    const { t } = useLanguage()
    const pathname = usePathname()

    if (pathname === '/' || pathname.startsWith('/admin')) return null

    return (
        <nav aria-label={t.footer.company} className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-6 py-8 text-xs font-bold text-subtle">
            <span>{SITE_NAME} by {COMPANY_NAME}</span>
            <Link href="/terms" className="hover:text-ink transition-colors">{t.footer.links.terms}</Link>
            <Link href="/privacy" className="hover:text-ink transition-colors">{t.footer.links.privacy}</Link>
            <Link href="/cookies" className="hover:text-ink transition-colors">{t.footer.links.cookies}</Link>
            <button type="button" onClick={openConsentSettings} className="font-bold hover:text-ink transition-colors">
                {t.legal.consent.settings_button}
            </button>
        </nav>
    )
}
