'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User, Mail, Globe, Bell, Shield, Trash2, Save } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card, { CardHeader, CardContent } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export default function SettingsPage() {
    const router = useRouter()
    const [user, setUser] = useState<SupabaseUser | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    // Form states
    const [displayName, setDisplayName] = useState('')
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [priceAlerts, setPriceAlerts] = useState(true)
    const [newsletter, setNewsletter] = useState(false)

    useEffect(() => {
        const supabase = createClient()

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                router.push('/login')
                return
            }
            setUser(session.user)
            setDisplayName(session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '')
            setLoading(false)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                router.push('/login')
                return
            }
            setUser(session.user)
        })

        return () => subscription.unsubscribe()
    }, [router])

    const handleSaveProfile = async () => {
        setSaving(true)
        setMessage(null)

        try {
            const supabase = createClient()
            const { error } = await supabase.auth.updateUser({
                data: { full_name: displayName }
            })

            if (error) throw error

            setMessage({ type: 'success', text: 'Profile updated successfully!' })
        } catch (error) {
            console.error('Error updating profile:', error)
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' })
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteAccount = async () => {
        if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            return
        }

        try {
            const supabase = createClient()
            // Note: In production, you'd want to call a server action to properly delete user data
            await supabase.auth.signOut()
            router.push('/')
        } catch (error) {
            console.error('Error deleting account:', error)
            setMessage({ type: 'error', text: 'Failed to delete account. Please try again.' })
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!user) {
        return null
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Back Button */}
                <Link href="/">
                    <Button variant="ghost" className="mb-8">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Button>
                </Link>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        <span className="gradient-text">Settings</span>
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your account settings and preferences
                    </p>
                </div>

                {/* Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-800'
                            : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-800'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Profile Settings */}
                <Card glass className="mb-6">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            <h2 className="text-2xl font-bold">Profile Information</h2>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Your name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    <Mail className="w-4 h-4 inline mr-1" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={user.email || ''}
                                    disabled
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 text-muted-foreground cursor-not-allowed"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Email cannot be changed
                                </p>
                            </div>

                            <Button
                                onClick={handleSaveProfile}
                                disabled={saving}
                                className="w-full sm:w-auto"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Notification Settings */}
                <Card glass className="mb-6">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Bell className="w-5 h-5 text-primary" />
                            <h2 className="text-2xl font-bold">Notifications</h2>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Email Notifications</p>
                                    <p className="text-sm text-muted-foreground">
                                        Receive updates about your account
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={emailNotifications}
                                        onChange={(e) => setEmailNotifications(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-300 dark:bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Price Alerts</p>
                                    <p className="text-sm text-muted-foreground">
                                        Get notified when prices drop
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={priceAlerts}
                                        onChange={(e) => setPriceAlerts(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-300 dark:bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Newsletter</p>
                                    <p className="text-sm text-muted-foreground">
                                        Weekly deals and tips
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={newsletter}
                                        onChange={(e) => setNewsletter(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-300 dark:bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Preferences */}
                <Card glass className="mb-6">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Globe className="w-5 h-5 text-primary" />
                            <h2 className="text-2xl font-bold">Preferences</h2>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Default Language
                                </label>
                                <select className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option value="en">English</option>
                                    <option value="fi">Suomi (Finnish)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Default City
                                </label>
                                <select className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option value="">Select a city</option>
                                    <option value="helsinki">Helsinki</option>
                                    <option value="espoo">Espoo</option>
                                    <option value="vantaa">Vantaa</option>
                                    <option value="tampere">Tampere</option>
                                    <option value="turku">Turku</option>
                                    <option value="oulu">Oulu</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-2 border-red-500/50">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-red-500" />
                            <h2 className="text-2xl font-bold text-red-500">Danger Zone</h2>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <p className="font-medium mb-2">Delete Account</p>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Once you delete your account, there is no going back. Please be certain.
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={handleDeleteAccount}
                                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Account
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
