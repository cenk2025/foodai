'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Utensils, ArrowRight, Github, Mail } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

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
        } catch (err: any) {
            setError(err.message || 'An error occurred during login')
        } finally {
            setLoading(false)
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
        } catch (err: any) {
            setError(err.message || 'An error occurred during OAuth login')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-md">
                <Link href="/" className="inline-flex items-center gap-2 mb-8 mx-auto justify-center w-full">
                    <div className="bg-gradient-to-tr from-blue-600 to-teal-500 p-2 rounded-lg text-white">
                        <Utensils className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
                        FoodAi
                    </span>
                </Link>

                <Card className="border-none shadow-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome back</h1>
                            <p className="text-gray-500 dark:text-gray-400">
                                Enter your credentials to access your account
                            </p>
                        </div>

                        <form className="space-y-4" onSubmit={handleEmailLogin}>
                            {error && (
                                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Email address
                                </label>
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="bg-white dark:bg-zinc-950"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Password
                                    </label>
                                    <Link href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="bg-white dark:bg-zinc-950"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full justify-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25"
                                loading={loading}
                                disabled={loading}
                            >
                                {!loading && (
                                    <>
                                        Sign In
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200 dark:border-zinc-800"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-zinc-900 text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="outline"
                                className="justify-center border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800"
                                onClick={() => handleOAuthLogin('github')}
                                disabled={loading}
                            >
                                <Github className="w-4 h-4 mr-2" />
                                Github
                            </Button>
                            <Button
                                variant="outline"
                                className="justify-center border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800"
                                onClick={() => handleOAuthLogin('google')}
                                disabled={loading}
                            >
                                <Mail className="w-4 h-4 mr-2" />
                                Google
                            </Button>
                        </div>
                    </div>

                    <div className="px-8 py-4 bg-gray-50/50 dark:bg-zinc-900/50 border-t border-gray-200 dark:border-zinc-800 text-center text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Don't have an account? </span>
                        <Link href="/signup" className="font-semibold text-blue-600 hover:text-blue-700">
                            Sign up
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    )
}
