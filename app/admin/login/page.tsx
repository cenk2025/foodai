'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [forgotMode, setForgotMode] = useState(false)
    const [forgotEmail, setForgotEmail] = useState('')
    const [forgotLoading, setForgotLoading] = useState(false)
    const [forgotMessage, setForgotMessage] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const response = await fetch('/api/admin/auth', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: { 'Content-Type': 'application/json' },
        })

        if (response.ok) {
            router.push('/admin')
            router.refresh()
        } else {
            const data = await response.json().catch(() => null)
            setError(data?.error || 'Virheellinen sähköposti tai salasana')
        }
    }

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setForgotLoading(true)
        setForgotMessage('')
        try {
            const supabase = createClient()
            const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
                redirectTo: `${window.location.origin}/reset-password`,
            })
            if (error) throw error
            setForgotMessage('✓ Palautuslinkki lähetetty sähköpostiisi!')
        } catch {
            setForgotMessage('Virhe: Yritä uudelleen')
        } finally {
            setForgotLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-page flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-[2rem] app-shadow border border-line w-full max-w-md text-center">
                <div className="bg-page w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-8 h-8 text-ink" />
                </div>
                <h1 className="text-2xl font-black text-ink mb-2">Admin Kirjautuminen</h1>
                <p className="text-subtle mb-8">Tämä alue on tarkoitettu vain hallinnoijille.</p>

                {forgotMode ? (
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-subtle/60" />
                            <input
                                type="email"
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                                placeholder="Sähköpostiosoite"
                                required
                                className="w-full pl-12 pr-5 py-4 bg-page border border-line rounded-xl outline-none focus:border-brand font-bold text-ink placeholder:text-subtle/60 transition-colors"
                            />
                        </div>
                        {forgotMessage && (
                            <p className={`text-sm font-bold ${forgotMessage.startsWith('✓') ? 'text-green-600' : 'text-brand'}`}>
                                {forgotMessage}
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={forgotLoading}
                            className="w-full bg-brand text-white py-4 rounded-xl font-black uppercase tracking-wider hover:bg-brand-dark transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {forgotLoading ? 'Lähetetään...' : 'Lähetä palautuslinkki'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setForgotMode(false)
                                setForgotMessage('')
                                setError('')
                            }}
                            className="w-full text-ink py-2 font-bold hover:underline"
                        >
                            Takaisin kirjautumiseen
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-subtle/60" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Sähköpostiosoite"
                                required
                                className="w-full pl-12 pr-5 py-4 bg-page border border-line rounded-xl outline-none focus:border-brand font-bold text-ink placeholder:text-subtle/60 transition-colors"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-subtle/60" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Salasana"
                                required
                                className="w-full pl-12 pr-5 py-4 bg-page border border-line rounded-xl outline-none focus:border-brand font-bold text-ink placeholder:text-subtle/60 transition-colors"
                            />
                        </div>

                        {error && (
                            <p className="text-brand text-sm font-bold">{error}</p>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-brand text-white py-4 rounded-xl font-black uppercase tracking-wider hover:bg-brand-dark transition-colors shadow-lg"
                        >
                            Kirjaudu Sisään
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setForgotMode(true)
                                setError('')
                            }}
                            className="w-full text-ink py-2 font-bold hover:underline"
                        >
                            Unohditko salasanasi?
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
