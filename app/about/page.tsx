import Link from 'next/link'
import { ArrowLeft, Target, TrendingDown, Shield, Zap } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card, { CardHeader, CardContent } from '@/components/ui/Card'

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-12">
                {/* Back Button */}
                <Link href="/">
                    <Button variant="ghost" className="mb-8">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Search
                    </Button>
                </Link>

                {/* Hero */}
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        About <span className="gradient-text">FoodAi</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Your smart companion for finding the best food deals in Finland
                    </p>
                </div>

                {/* Mission */}
                <div className="max-w-4xl mx-auto mb-16">
                    <Card glass>
                        <CardHeader>
                            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                FoodAi is a price comparison platform designed to help you save money on food orders.
                                Just like Trivago revolutionized hotel booking, we're making it easy to find the cheapest
                                meals across multiple delivery platforms and restaurants in Finland.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Features */}
                <div className="max-w-6xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Choose FoodAi?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card hover>
                            <CardHeader>
                                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                                    <TrendingDown className="w-6 h-6 text-accent" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Save Money</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Compare prices across platforms and save up to 30% on every order
                                </p>
                            </CardContent>
                        </Card>

                        <Card hover>
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                    <Zap className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Fast Search</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Find the best deals in seconds with our smart search and filters
                                </p>
                            </CardContent>
                        </Card>

                        <Card hover>
                            <CardHeader>
                                <div className="w-12 h-12 bg-food-orange/10 rounded-lg flex items-center justify-center mb-4">
                                    <Target className="w-6 h-6 text-food-orange" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Personalized</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Filter by dietary preferences, price range, and delivery options
                                </p>
                            </CardContent>
                        </Card>

                        <Card hover>
                            <CardHeader>
                                <div className="w-12 h-12 bg-food-green/10 rounded-lg flex items-center justify-center mb-4">
                                    <Shield className="w-6 h-6 text-food-green" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Transparent</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    No hidden fees. See real prices including delivery costs
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* How It Works */}
                <div className="max-w-4xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
                    <div className="space-y-6">
                        <Card glass>
                            <CardHeader>
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                                        1
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Search for Your Meal</h3>
                                        <p className="text-muted-foreground">
                                            Enter what you're craving - pizza, sushi, kebab, or anything else.
                                            Select your city to see local offers.
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>

                        <Card glass>
                            <CardHeader>
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                                        2
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Compare Prices</h3>
                                        <p className="text-muted-foreground">
                                            We show you the same meal from different platforms, sorted by price.
                                            Apply filters for dietary needs, ratings, and delivery options.
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>

                        <Card glass>
                            <CardHeader>
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                                        3
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Order & Save</h3>
                                        <p className="text-muted-foreground">
                                            Click "Go to Deal" to be redirected to the platform with the best price.
                                            Complete your order there and enjoy your savings!
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    </div>
                </div>

                {/* Demo Notice */}
                <div className="max-w-4xl mx-auto">
                    <Card className="border-2 border-food-yellow">
                        <CardHeader>
                            <h3 className="text-xl font-semibold mb-2">📢 Demo Version</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">
                                This is a demonstration version of FoodAi. All prices, restaurants, and offers
                                are for demo purposes only. In a production version, we would integrate with
                                official platform APIs and affiliate programs.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Built with Next.js, TypeScript, Supabase, and Tailwind CSS.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
