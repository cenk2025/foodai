'use client'

import { useSyncExternalStore } from 'react'
import { useLanguage } from '@/lib/i18n/context'
import { getConsent, openConsentSettings, subscribeToConsent } from '@/lib/consent'

// The place to change or withdraw the choice made in the popup.
export default function ConsentSettings() {
    const { t } = useLanguage()
    const choice = useSyncExternalStore(subscribeToConsent, getConsent, () => null)
    const text = t.legal.consent
    const status = choice === 'statistics' ? text.status_statistics : choice === 'necessary' ? text.status_necessary : text.status_none

    return (
        <div className="bg-white rounded-[2rem] p-8 app-shadow border border-line">
            <h2 className="text-xl font-black text-ink mb-4">{text.settings_title}</h2>
            <p className="text-subtle font-medium leading-relaxed mb-6">{status}</p>
            <button
                type="button"
                onClick={openConsentSettings}
                className="rounded-2xl bg-brand px-6 py-3 text-sm font-black text-white transition-colors hover:bg-brand-dark"
            >
                {text.settings_button}
            </button>
        </div>
    )
}
