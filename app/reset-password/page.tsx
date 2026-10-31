'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock, Utensils } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

function ResetPasswordForm() {
    const router = useRouter()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [sessionReady, setSessionReady] = useState(false)

    const searchParams = useSearchParams()
    const [linkError, setLinkError] = useState('')

    useEffect(() => {
        // Recovery links can arrive in several shapes depending on the Supabase
        // auth flow and email template, so establish the session for each:
        //   ?token_hash=...&type=recovery  (recommended template, works cross-device)
        //   ?code=...                      (PKCE; only works in the browser that asked)
        //   #access_token=...&type=recovery (implicit flow)
        //   #error=...&error_description=... (expired / already used link)
        const supabase = createClient()
        let cancelled = false

        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
            if (!cancelled && session && (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN')) {
                setSessionReady(true)
            }
        })

        async function establishSession() {
            const hashParams = new URLSearchParams(window.location.hash.slice(1))
            const tokenHash = searchParams.get('token_hash')
            const code = searchParams.get('code')
            const urlError =
                searchParams.get('error_description') ?? hashParams.get('error_description')

            if (urlError) throw new Error(urlError)

            if (tokenHash) {
                const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'recovery' })
                if (error) throw error
            } else if (code) {
                // The browser client may already have exchanged the code on init.
                const { data } = await supabase.auth.getSession()
                if (!data.session) {
                    const { error } = await supabase.auth.exchangeCodeForSession(code)
                    if (error) {
                        throw new Error(
                            'Linkki täytyy avata samassa selaimessa, jossa palautusta pyydettiin. Pyydä uusi linkki.',
                        )
                    }
                }
            } else if (hashParams.get('access_token') && hashParams.get('refresh_token')) {
                const { error } = await supabase.auth.setSession({
                    access_token: hashParams.get('access_token')!,
                    refresh_token: hashParams.get('refresh_token')!,
                })
                if (error) throw error
            }

            const { data } = await supabase.auth.getSession()
            if (!data.session) {
                throw new Error('Palautuslinkki puuttuu tai on vanhentunut. Pyydä uusi linkki.')
            }
            if (!cancelled) setSessionReady(true)
        }

        establishSession().catch((err: Error) => {
            if (!cancelled) setLinkError(err.message || 'Palautuslinkki ei kelpaa. Pyydä uusi linkki.')
        })

        return () => {
            cancelled = true
            listener.subscription.unsubscribe()
        }
    }, [searchParams])

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!password || !confirmPassword) {
            setError('Täytä kaikki kentät')
            return
        }
        if (password !== confirmPassword) {
            setError('Salasanat eivät täsmää')
            return
        }
        if (password.length < 8) {
            setError('Salasanan on oltava vähintään 8 merkkiä pitkä')
            return
        }

        setLoading(true)
        try {
            const supabase = createClient()
            const { error } = await supabase.auth.updateUser({ password })
            if (error) throw error
            setSuccess(true)
            setTimeout(() => router.push('/'), 2500)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Salasanan vaihto epäonnistui')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="text-center">
                <div className="w-20 h-20 bg-[#27ae60]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-10 h-10 text-[#27ae60]" />
                </div>
                <h2 className="text-2xl font-black text-[#3d1d11] mb-2">Salasana vaihdettu!</h2>
                <p className="text-[#a08a7e]">Sinut ohjataan automaattisesti etusivulle...</p>
            </div>
        )
    }

    if (!sessionReady) {
        return (
            <div className="text-center space-y-4">
                {linkError ? (
                    <>
                        <p className="text-sm text-[#e74c3c] font-bold">{linkError}</p>
                        <button
                            type="button"
                            onClick={() => router.push('/admin/login')}
                            className="text-xs font-black uppercase tracking-[0.2em] text-[#3d1d11] underline"
                        >
                            Pyydä uusi linkki
                        </button>
                    </>
                ) : (
                    <p className="text-[#a08a7e]">Tarkistetaan palautuslinkkiä...</p>
                )}
            </div>
        )
    }

    return (
        <>
            <div className="text-center mb-10">
                <h1 className="text-3xl font-black text-[#3d1d11] mb-3 tracking-tight">Uusi salasana</h1>
                <p className="text-[#a08a7e] font-medium">Valitse uusi salasana tilillesi</p>
            </div>

            <form className="space-y-6" onSubmit={handleReset}>
                {error && (
                    <div className="p-4 rounded-2xl bg-[#e74c3c]/5 border border-[#e74c3c]/20">
                        <p className="text-sm text-[#e74c3c] font-bold text-center">{error}</p>
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#3d1d11] ml-2">
                        Uusi salasana
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a08a7e]" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••  (min. 8 merkkiä)"
                            disabled={loading}
                            required
                            className="w-full bg-[#fdf2e2]/50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#f3d179] transition-all font-medium placeholder:text-[#a08a7e]/50"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#3d1d11] ml-2">
                        Vahvista salasana
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a08a7e]" />
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            disabled={loading}
                            required
                            className="w-full bg-[#fdf2e2]/50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#f3d179] transition-all font-medium placeholder:text-[#a08a7e]/50"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#3d1d11] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-[#d35400] transition-all active:scale-95 shadow-xl disabled:opacity-50"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
                    ) : 'Vahvista uusi salasana'}
                </button>
            </form>
        </>
    )
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-[#fffcf8] flex flex-col items-center justify-center p-6 relative overflow-hidden font-outfit">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#f3d179]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#d35400]/5 rounded-full blur-3xl" />

            <div className="w-full max-w-md relative z-10">
                <div className="flex items-center gap-3 mb-12 justify-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#3d1d11] flex items-center justify-center shadow-xl">
                        <Utensils className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-3xl font-black tracking-tight text-[#3d1d11]">
                        Food<span className="text-[#d35400]">AI</span>
                    </span>
                </div>

                <div className="bg-white rounded-[3rem] p-10 app-shadow border border-[#f1ebd8]">
                    <Suspense fallback={<div className="text-center text-[#a08a7e]">Ladataan...</div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}
