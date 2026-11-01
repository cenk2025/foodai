'use client'

import ConsentSettings from '@/components/legal/ConsentSettings'
import LegalPage from '@/components/legal/LegalPage'
import { useLanguage } from '@/lib/i18n/context'

export default function Page() {
    const { t } = useLanguage()

    return (
        <LegalPage page={t.legal.cookies}>
            <ConsentSettings />
        </LegalPage>
    )
}
