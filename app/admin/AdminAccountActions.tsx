'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, LogOut } from 'lucide-react'

export default function AdminAccountActions() {
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
    const [logoutLoading, setLogoutLoading] = useState(false)
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordLoading, setPasswordLoading] = useState(false)
    const [passwordError, setPasswordError] = useState('')
    const [passwordSuccess, setPasswordSuccess] = useState('')
    const router = useRouter()

    const handlePasswordChange = async () => {
        setPasswordLoading(true)
        setPasswordError('')
        setPasswordSuccess('')
        try {
            const res = await fetch('/api/admin/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
            })
            const data = await res.json()
            if (!res.ok) {
                setPasswordError(data.error || 'Jokin meni pieleen')
            } else {
                setPasswordSuccess('Salasana vaihdettu onnistuneesti!')
                setCurrentPassword('')
                setNewPassword('')
                setConfirmPassword('')
                setTimeout(() => { setIsPasswordModalOpen(false); setPasswordSuccess('') }, 1500)
            }
        } catch {
            setPasswordError('Verkkovirhe. Yritä uudelleen.')
        } finally {
            setPasswordLoading(false)
        }
    }

    const handleLogout = async () => {
        setLogoutLoading(true)
        await fetch('/api/admin/logout', { method: 'POST' })
        router.push('/admin/login')
        router.refresh()
    }

    return (
        <>
            {/* Password Change Modal */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-[2rem] max-w-md w-full shadow-2xl border border-line">
                        <h2 className="text-xl font-black text-ink mb-2">Vaihda Salasana</h2>
                        <p className="text-sm text-subtle mb-6">Syötä nykyinen salasanasi ja valitse uusi.</p>

                        <div className="space-y-4">
                            <input
                                type="password"
                                placeholder="Nykyinen salasana"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-page border border-line outline-none focus:border-brand transition-colors"
                            />
                            <input
                                type="password"
                                placeholder="Uusi salasana (min. 12 merkkiä)"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-page border border-line outline-none focus:border-brand transition-colors"
                            />
                            <input
                                type="password"
                                placeholder="Vahvista uusi salasana"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-page border border-line outline-none focus:border-brand transition-colors"
                            />
                        </div>

                        {passwordError && (
                            <p className="mt-4 text-sm text-brand font-bold text-center">{passwordError}</p>
                        )}
                        {passwordSuccess && (
                            <p className="mt-4 text-sm text-save font-bold text-center">{passwordSuccess}</p>
                        )}

                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                onClick={() => { setIsPasswordModalOpen(false); setPasswordError(''); setPasswordSuccess('') }}
                                className="px-6 py-3 rounded-xl font-bold text-subtle hover:bg-page transition-colors"
                                disabled={passwordLoading}
                            >
                                Peruuta
                            </button>
                            <button
                                onClick={handlePasswordChange}
                                disabled={passwordLoading}
                                className="px-6 py-3 rounded-xl font-bold bg-brand text-white hover:bg-brand-dark transition-colors shadow-lg disabled:opacity-50"
                            >
                                {passwordLoading ? 'Tallennetaan...' : 'Tallenna'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-line text-ink hover:bg-page transition-colors flex items-center gap-2"
                >
                    <Lock className="w-3 h-3" />
                    Vaihda Salasana
                </button>
                <button
                    onClick={handleLogout}
                    disabled={logoutLoading}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-brand text-white hover:bg-brand-dark transition-colors flex items-center gap-2 shadow-lg"
                >
                    <LogOut className="w-3 h-3" />
                    {logoutLoading ? 'Kirjaudutaan ulos...' : 'Kirjaudu Ulos'}
                </button>
            </div>
        </>
    )
}
