'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'

export default function AdminLogin() {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Simple verification (In production this should be a real auth check)
        // We'll set a cookie via a server action or API route ideally, 
        // but for this iteration let's use a server action we'll create next.

        const response = await fetch('/api/admin/auth', {
            method: 'POST',
            body: JSON.stringify({ password }),
            headers: { 'Content-Type': 'application/json' },
        })

        if (response.ok) {
            router.push('/admin')
            router.refresh()
        } else {
            setError('Virheellinen salasana')
        }
    }

    return (
        <div className="min-h-screen bg-[#fffcf8] flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-[2rem] app-shadow border border-[#f1ebd8] w-full max-w-md text-center">
                <div className="bg-[#fffcf8] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-8 h-8 text-[#3d1d11]" />
                </div>
                <h1 className="text-2xl font-black text-[#3d1d11] mb-2">Admin Kirjautuminen</h1>
                <p className="text-[#a08a7e] mb-8">Tämä alue on tarkoitettu vain hallinnoijille.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Syötä hallintapalasana"
                            className="w-full px-5 py-4 bg-[#fffcf8] border border-[#f1ebd8] rounded-xl outline-none focus:border-[#3d1d11] font-bold text-[#3d1d11] placeholder:text-[#d0c0b0] transition-colors"
                        />
                    </div>

                    {error && (
                        <p className="text-[#e74c3c] text-sm font-bold">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-[#3d1d11] text-white py-4 rounded-xl font-black uppercase tracking-wider hover:bg-[#d35400] transition-colors shadow-lg"
                    >
                        Kirjaudu Sisään
                    </button>
                </form>
            </div>
        </div>
    )
}
