'use client'

import { Mail } from 'lucide-react'
import { CONTACT_EMAIL, PageShell, SectionList } from '@/components/legal/LegalPage'
import { useLanguage } from '@/lib/i18n/context'

export default function PartnersPage() {
    const { t } = useLanguage()
    const page = t.legal.partners

    return (
        <PageShell title={page.title} intro={page.intro}>
            <SectionList sections={page.sections} />
            <div className="bg-white rounded-[2rem] p-8 app-shadow border border-line">
                <h2 className="text-xl font-black text-ink mb-4">{page.contact_title}</h2>
                <p className="text-subtle font-medium leading-relaxed mb-6">{page.contact_text}</p>
                <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-3 bg-brand text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-brand-dark transition-colors">
                    <Mail className="w-4 h-4" />
                    {CONTACT_EMAIL}
                </a>
            </div>
        </PageShell>
    )
}
