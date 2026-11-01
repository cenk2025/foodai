'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Utensils, ArrowRight, Github, Mail, User as UserIcon, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
    const router = useRouter()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleEmailSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            const supabase = createClient()
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        full_name: `${firstName} ${lastName}`,
                    },
                },
            })

            if (error) throw error

            setSuccess(true)
            // Redirect to home page after successful signup
            setTimeout(() => {
                router.push('/')
                router.refresh()
            }, 2000)
        } catch (err) {
            setError((err instanceof Error && err.message) || 'An error occurred during signup')
        } finally {
            setLoading(false)
        }
    }

    const handleOAuthSignup = async (provider: 'github' | 'google') => {
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
            setError((err instanceof Error && err.message) || 'An error occurred during OAuth signup')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-page flex flex-col items-center justify-center p-6 relative overflow-hidden font-outfit">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/10 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand/5 rounded-full blur-3xl" />

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
                        <h1 className="text-3xl font-black text-ink mb-3 tracking-tight">Luo tili</h1>
                        <p className="text-subtle font-medium">Liity mukaan ja löydä parhaat säästöt</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleEmailSignup}>
                        {error && (
                            <div className="p-4 rounded-2xl bg-brand/5 border border-brand/20">
                                <p className="text-sm text-brand font-bold text-center">{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="p-4 rounded-2xl bg-save/5 border border-save/20">
                                <p className="text-sm text-save font-bold text-center">
                                    Tili luotu onnistuneesti! Ohjataan...
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-ink ml-2">
                                    Etunimi
                                </label>
                                <input
                                    placeholder="John"
                                    className="w-full bg-soft/50 border-none rounded-2xl py-4 px-4 text-sm focus:ring-2 focus:ring-brand/30 transition-all font-medium placeholder:text-subtle/50"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-ink ml-2">
                                    Sukunimi
                                </label>
                                <input
                                    placeholder="Doe"
                                    className="w-full bg-soft/50 border-none rounded-2xl py-4 px-4 text-sm focus:ring-2 focus:ring-brand/30 transition-all font-medium placeholder:text-subtle/50"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>

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
                            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-ink ml-2">
                                Salasana
                            </label>
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
                            <p className="text-[10px] text-subtle ml-2 font-medium italic">Vähintään 8 merkkiä</p>
                        </div>

                        <div className="flex items-start ml-2">
                            <input type="checkbox" className="mt-1 mr-3 accent-brand" required disabled={loading} />
                            <span className="text-[10px] text-subtle leading-relaxed font-medium">
                                Hyväksyn <Link href="/terms" target="_blank" className="text-ink underline decoration-brand/20 font-black uppercase tracking-wider">Käyttöehdot</Link> ja <Link href="/privacy" target="_blank" className="text-ink underline decoration-brand/20 font-black uppercase tracking-wider">Tietosuojaselosteen</Link>
                            </span>
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
                                    Luo Tili
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-line"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px]">
                            <span className="px-4 bg-white text-subtle font-black uppercase tracking-widest">Tai Rekisteröidy</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            className="flex items-center justify-center gap-3 bg-soft/50 hover:bg-soft py-4 rounded-2xl border border-line transition-all group"
                            onClick={() => handleOAuthSignup('github')}
                            disabled={loading}
                        >
                            <Github className="w-5 h-5 text-ink group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-black text-ink uppercase tracking-wider">Github</span>
                        </button>
                        <button
                            className="flex items-center justify-center gap-3 bg-soft/50 hover:bg-soft py-4 rounded-2xl border border-line transition-all group"
                            onClick={() => handleOAuthSignup('google')}
                            disabled={loading}
                        >
                            <Mail className="w-5 h-5 text-ink group-hover:scale-110 transition-transform" />
                            <span className="text-[11px] font-black text-ink uppercase tracking-wider">Google</span>
                        </button>
                    </div>

                    <div className="mt-10 text-center">
                        <p className="text-[11px] font-medium text-subtle">
                            Onko sinulla jo tili? {' '}
                            <Link href="/login" className="text-ink font-black uppercase tracking-wider hover:text-brand underline underline-offset-4 decoration-2 decoration-brand/20 hover:decoration-brand">
                                Kirjaudu sisään
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
