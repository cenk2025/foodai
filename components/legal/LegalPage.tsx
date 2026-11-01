'use client'

import Link from 'next/link'
import { ArrowLeft, Mail } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'
import type { LegalSection } from '@/lib/i18n/dictionary'

export const CONTACT_EMAIL = 'info@foodai.fi'

type Page = { title: string; intro: string; sections: LegalSection[] }

export function PageShell({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
    const { t } = useLanguage()

    return (
        <div className="min-h-screen bg-page font-outfit pb-24 md:pb-12">
            <div className="bg-brand pt-16 pb-32">
                <div className="container mx-auto px-6 max-w-3xl">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-8 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t.legal.back}</span>
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">{title}</h1>
                    <p className="text-white/90 font-medium leading-relaxed">{intro}</p>
                </div>
            </div>
            <div className="container mx-auto px-6 max-w-3xl -mt-16 space-y-6">{children}</div>
        </div>
    )
}

export function SectionList({ sections }: { sections: LegalSection[] }) {
    return (
        <div className="bg-white rounded-[2rem] p-8 md:p-12 app-shadow border border-line space-y-10">
            {sections.map((section) => (
                <section key={section.heading}>
                    <h2 className="text-xl font-black text-ink mb-4">{section.heading}</h2>
                    {section.items && (
                        <ul className="list-disc pl-5 space-y-2 mb-4 last:mb-0 text-subtle font-medium leading-relaxed">
                            {section.items.map((item) => <li key={item}>{item}</li>)}
                        </ul>
                    )}
                    {section.paragraphs?.map((paragraph) => (
                        <p key={paragraph} className="text-subtle font-medium leading-relaxed mb-4 last:mb-0">{paragraph}</p>
                    ))}
                </section>
            ))}
        </div>
    )
}

export default function LegalPage({ page, children }: { page: Page; children?: React.ReactNode }) {
    const { t } = useLanguage()

    return (
        <PageShell title={page.title} intro={page.intro}>
            <SectionList sections={page.sections} />
            {children}
            <div className="bg-white rounded-[2rem] p-8 app-shadow border border-line">
                <h2 className="text-xl font-black text-ink mb-4">{t.legal.contact_title}</h2>
                <p className="text-subtle font-medium leading-relaxed mb-4">{t.legal.contact_operator}</p>
                <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-2 text-brand font-black hover:text-brand-dark transition-colors">
                    <Mail className="w-4 h-4" />
                    {CONTACT_EMAIL}
                </a>
                <p className="text-sm text-subtle font-medium mt-6">{t.legal.updated}</p>
            </div>
        </PageShell>
    )
}
