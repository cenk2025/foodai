'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User, Mail, Calendar, MapPin, Heart, Clock, TrendingDown } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card, { CardHeader, CardContent } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export default function ProfilePage() {
    const router = useRouter()
    const [user, setUser] = useState<SupabaseUser | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const supabase = createClient()

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                router.push('/login')
                return
            }
            setUser(session.user)
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

    const getUserDisplayName = () => {
        if (!user) return ''
        return user.user_metadata?.full_name ||
            user.user_metadata?.first_name ||
            user.email?.split('@')[0] ||
            'User'
    }

    const getUserInitials = () => {
        const name = getUserDisplayName()
        return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    }

    const getJoinDate = () => {
        if (!user?.created_at) return 'Unknown'
        return new Date(user.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
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

                {/* Profile Header */}
                <Card glass className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                            {/* Avatar */}
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                                {getUserInitials()}
                            </div>

                            {/* User Info */}
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-3xl font-bold mb-2">
                                    {getUserDisplayName()}
                                </h1>
                                <div className="flex flex-col md:flex-row gap-4 text-muted-foreground mb-4">
                                    <div className="flex items-center justify-center md:justify-start gap-2">
                                        <Mail className="w-4 h-4" />
                                        <span className="text-sm">{user.email}</span>
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-sm">Joined {getJoinDate()}</span>
                                    </div>
                                </div>
                                <Link href="/settings">
                                    <Button variant="outline">
                                        Edit Profile
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card hover>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                                    <TrendingDown className="w-6 h-6 text-accent" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">€0</p>
                                    <p className="text-sm text-muted-foreground">Total Saved</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card hover>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Heart className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">0</p>
                                    <p className="text-sm text-muted-foreground">Favorites</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card hover>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-food-orange/10 rounded-lg flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-food-orange" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">0</p>
                                    <p className="text-sm text-muted-foreground">Recent Searches</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <Card glass className="mb-6">
                    <CardHeader>
                        <h2 className="text-2xl font-bold">Recent Activity</h2>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-12">
                            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground mb-4">No recent activity yet</p>
                            <Link href="/">
                                <Button>
                                    Start Searching for Deals
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Favorite Restaurants */}
                <Card glass>
                    <CardHeader>
                        <h2 className="text-2xl font-bold">Favorite Restaurants</h2>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-12">
                            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground mb-4">No favorites yet</p>
                            <p className="text-sm text-muted-foreground">
                                Save your favorite restaurants to quickly find deals
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
