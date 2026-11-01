'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Utensils, ArrowRight, Github, Mail, Lock, User as UserIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [forgotMode, setForgotMode] = useState(false)
    const [forgotEmail, setForgotEmail] = useState('')
    const [forgotLoading, setForgotLoading] = useState(false)
    const [forgotMessage, setForgotMessage] = useState<string | null>(null)

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const supabase = createClient()
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            router.push('/')
            router.refresh()
        } catch (err) {
            setError((err instanceof Error && err.message) || 'An error occurred during login')
        } finally {
            setLoading(false)
        }
    }

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setForgotLoading(true)
        setForgotMessage(null)
        try {
            const supabase = createClient()
            const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
                redirectTo: `${window.location.origin}/reset-password`,
            })
            if (error) throw error
            setForgotMessage('Salasanan palautuslinkki lähetetty sähköpostiisi!')
        } catch (err) {
            setForgotMessage('Virhe: ' + ((err instanceof Error && err.message) || 'Yritä uudelleen'))
        } finally {
            setForgotLoading(false)
        }
    }

    const handleOAuthLogin = async (provider: 'github' | 'google') => {
        setLoading(true)
        setError(null)

        try {
            const supabase = createClient()
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })

            if (error) throw error
        } catch (err) {
            setError((err instanceof Error && err.message) || 'An error occurred during OAuth login')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-page flex flex-col items-center justify-center p-6 relative overflow-hidden font-outfit">
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand/10 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/5 rounded-full blur-3xl" />

            <div className="w-full max-w-md relative z-10">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-3 mb-12 justify-center group">
                    <div className="w-12 h-12 rounded-2xl bg-brand flex items-center justify-center shadow-xl transform group-hover:rotate-3 transition-transform">
                        <Utensils className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-3xl font-black tracking-tight text-ink">
                        Food<span className="text-brand">AI</span>
                    </span>
                </Link>

                <div className="bg-white rounded-[3rem] p-10 app-shadow border border-line">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-black text-ink mb-3 tracking-tight">Tervetuloa takaisin</h1>
                        <p className="text-subtle font-medium">Kirjaudu sisään säästääksesi vielä enemmän</p>
                    </div>

                {forgotMode ? (
                        /* Forgot Password Form */
                        <form className="space-y-6" onSubmit={handleForgotPassword}>
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-black text-ink mb-3 tracking-tight">Unohditko salasanan?</h1>
                                <p className="text-subtle font-medium">Syötä sähköpostisi niin lähetämme palautuslinkin.</p>
                            </div>

                            {forgotMessage && (
                                <div className={`p-4 rounded-2xl border text-center ${
                                    forgotMessage.startsWith('Virhe')
                                        ? 'bg-brand/5 border-brand/20'
                                        : 'bg-save/5 border-save/20'
                                }`}>
                                    <p className={`text-sm font-bold ${
                                        forgotMessage.startsWith('Virhe') ? 'text-brand' : 'text-save'
                                    }`}>{forgotMessage}</p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-ink ml-2">Sähköposti</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-subtle group-focus-within:text-brand transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="nimi@esimerkki.com"
                                        className="w-full bg-soft/50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-brand/30 transition-all font-medium placeholder:text-subtle/50"
                                        value={forgotEmail}
                                        onChange={(e) => setForgotEmail(e.target.value)}
                                        disabled={forgotLoading}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-brand text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-brand-dark transition-all active:scale-95 shadow-xl flex items-center justify-center gap-3"
                                disabled={forgotLoading}
                            >
                                {forgotLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : 'Lähetä palautuslinkki'}
                            </button>

                            <button
                                type="button"
                                onClick={() => { setForgotMode(false); setForgotMessage(null) }}
                                className="w-full text-subtle text-xs font-bold uppercase tracking-wider hover:text-ink transition-colors"
                            >
                                ← Takaisin kirjautumiseen
                            </button>
                        </form>
                    ) : (
                    /* Login Form */
                    <form className="space-y-6" onSubmit={handleEmailLogin}>
                        {error && (
                            <div className="p-4 rounded-2xl bg-brand/5 border border-brand/20">
                                <p className="text-sm text-brand font-bold text-center">{error}</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-ink ml-2">
                                Sähköposti
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-subtle group-focus-within:text-brand transition-colors">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="nimi@esimerkki.com"
                                    className="w-full bg-soft/50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-brand/30 transition-all font-medium placeholder:text-subtle/50"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-2">
                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-ink">
                                    Salasana
                                </label>
                                <button
                                    type="button"
                                    onClick={() => { setForgotMode(true); setForgotEmail(email) }}
                                    className="text-[10px] text-ink/60 hover:text-brand font-black uppercase tracking-wider transition-colors"
                                >
                                    Unohditko?
                                </button>
                            </div>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-subtle group-focus-within:text-brand transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-soft/50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-brand/30 transition-all font-medium placeholder:text-subtle/50"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-brand text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-brand-dark transition-all active:scale-95 shadow-xl flex items-center justify-center gap-3"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Kirjaudu Sisään
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                    )}

                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-line"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px]">
                            <span className="px-4 bg-white text-subtle font-black uppercase tracking-widest">Tai Kirjaudu</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            className="flex items-center justify-center gap-3 bg-soft/50 hover:bg-soft py-4 rounded-2xl border border-line transition-all group"
                            onClick={() => handleOAuthLogin('github')}
                            disabled={loading}
                        >
                            <Github className="w-5 h-5 text-ink group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-black text-ink uppercase tracking-wider">Github</span>
                        </button>
                        <button
                            className="flex items-center justify-center gap-3 bg-soft/50 hover:bg-soft py-4 rounded-2xl border border-line transition-all group"
                            onClick={() => handleOAuthLogin('google')}
                            disabled={loading}
                        >
                            <Mail className="w-5 h-5 text-ink group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-black text-ink uppercase tracking-wider">Google</span>
                        </button>
                    </div>

                    <div className="mt-10 text-center">
                        <p className="text-[11px] font-medium text-subtle">
                            Eikö sinulla ole tiliä? {' '}
                            <Link href="/signup" className="text-ink font-black uppercase tracking-wider hover:text-brand underline underline-offset-4 decoration-2 decoration-brand/20 hover:decoration-brand">
                                Luo tili
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
