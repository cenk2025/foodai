'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Utensils, ArrowRight, Github, Mail } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
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
        } catch (err: any) {
            setError(err.message || 'An error occurred during signup')
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
        } catch (err: any) {
            setError(err.message || 'An error occurred during OAuth signup')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-3xl"></div>
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
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create an account</h1>
                            <p className="text-gray-500 dark:text-gray-400">
                                Join thousands of foodies saving money every day
                            </p>
                        </div>

                        <form className="space-y-4" onSubmit={handleEmailSignup}>
                            {error && (
                                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                                </div>
                            )}

                            {success && (
                                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                                    <p className="text-sm text-green-600 dark:text-green-400">
                                        Account created successfully! Redirecting...
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        First Name
                                    </label>
                                    <Input
                                        placeholder="John"
                                        className="bg-white dark:bg-zinc-950"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        disabled={loading}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Last Name
                                    </label>
                                    <Input
                                        placeholder="Doe"
                                        className="bg-white dark:bg-zinc-950"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        disabled={loading}
                                        required
                                    />
                                </div>
                            </div>

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
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Password
                                </label>
                                <Input
                                    type="password"
                                    placeholder="Create a password"
                                    className="bg-white dark:bg-zinc-950"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                                <p className="text-xs text-gray-400 mt-1">Must be at least 8 characters</p>
                            </div>

                            <div className="flex items-start">
                                <input type="checkbox" className="mt-1 mr-2" required disabled={loading} />
                                <span className="text-xs text-gray-500">I agree to the <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link></span>
                            </div>

                            <Button
                                type="submit"
                                className="w-full justify-center bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg shadow-teal-500/25"
                                loading={loading}
                                disabled={loading}
                            >
                                {!loading && (
                                    <>
                                        Create Account
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
                                <span className="px-2 bg-white dark:bg-zinc-900 text-gray-500">Or register with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="outline"
                                className="justify-center border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800"
                                onClick={() => handleOAuthSignup('github')}
                                disabled={loading}
                            >
                                <Github className="w-4 h-4 mr-2" />
                                Github
                            </Button>
                            <Button
                                variant="outline"
                                className="justify-center border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800"
                                onClick={() => handleOAuthSignup('google')}
                                disabled={loading}
                            >
                                <Mail className="w-4 h-4 mr-2" />
                                Google
                            </Button>
                        </div>
                    </div>

                    <div className="px-8 py-4 bg-gray-50/50 dark:bg-zinc-900/50 border-t border-gray-200 dark:border-zinc-800 text-center text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Already have an account? </span>
                        <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                            Sign in
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    )
}
