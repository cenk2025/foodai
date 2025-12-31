import Link from 'next/link'
import { ArrowLeft, Search, Filter, ShoppingCart, TrendingDown, Zap, Shield, Heart } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card, { CardHeader, CardContent } from '@/components/ui/Card'

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-12">
                {/* Back Button */}
                <Link href="/">
                    <Button variant="ghost" className="mb-8">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Button>
                </Link>

                {/* Hero */}
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        How <span className="gradient-text">FoodAi</span> Works
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Save money on every meal with our smart price comparison platform
                    </p>
                </div>

                {/* How It Works Steps */}
                <div className="max-w-4xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-center mb-12">Three Simple Steps</h2>
                    <div className="space-y-6">
                        <Card glass>
                            <CardHeader>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xl">
                                        1
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Search className="w-5 h-5 text-primary" />
                                            <h3 className="text-xl font-semibold">Search for Your Meal</h3>
                                        </div>
                                        <p className="text-muted-foreground">
                                            Enter what you're craving - pizza, sushi, kebab, or anything else.
                                            Select your city to see local offers. Our smart search understands
                                            what you're looking for.
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>

                        <Card glass>
                            <CardHeader>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xl">
                                        2
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Filter className="w-5 h-5 text-primary" />
                                            <h3 className="text-xl font-semibold">Compare Prices & Filter</h3>
                                        </div>
                                        <p className="text-muted-foreground">
                                            We show you the same meal from different platforms (Wolt, Foodora, UberEats),
                                            sorted by price. Apply filters for dietary needs (vegan, gluten-free),
                                            ratings, and delivery options to find your perfect match.
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>

                        <Card glass>
                            <CardHeader>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xl">
                                        3
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <ShoppingCart className="w-5 h-5 text-primary" />
                                            <h3 className="text-xl font-semibold">Order & Save</h3>
                                        </div>
                                        <p className="text-muted-foreground">
                                            Click "Order" to be redirected to the platform with the best price.
                                            Complete your order there and enjoy your savings! We show you the
                                            total price including delivery fees, so no surprises.
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    </div>
                </div>

                {/* Key Features */}
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
                                    Compare prices across all major platforms and save up to 30% on every order
                                </p>
                            </CardContent>
                        </Card>

                        <Card hover>
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                    <Zap className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Fast & Easy</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Find the best deals in seconds with our smart search and intuitive filters
                                </p>
                            </CardContent>
                        </Card>

                        <Card hover>
                            <CardHeader>
                                <div className="w-12 h-12 bg-food-orange/10 rounded-lg flex items-center justify-center mb-4">
                                    <Shield className="w-6 h-6 text-food-orange" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Transparent</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    No hidden fees. See real prices including delivery costs before you order
                                </p>
                            </CardContent>
                        </Card>

                        <Card hover>
                            <CardHeader>
                                <div className="w-12 h-12 bg-food-green/10 rounded-lg flex items-center justify-center mb-4">
                                    <Heart className="w-6 h-6 text-food-green" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Personalized</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Filter by dietary preferences, price range, and delivery options
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-4xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <Card glass>
                            <CardHeader>
                                <h3 className="text-lg font-semibold mb-2">Is FoodAi free to use?</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Yes! FoodAi is completely free. We help you find the best deals without any charges.
                                </p>
                            </CardContent>
                        </Card>

                        <Card glass>
                            <CardHeader>
                                <h3 className="text-lg font-semibold mb-2">Do I need to create an account?</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    No account is required to search and compare prices. However, creating an account
                                    lets you save favorites and track your savings over time.
                                </p>
                            </CardContent>
                        </Card>

                        <Card glass>
                            <CardHeader>
                                <h3 className="text-lg font-semibold mb-2">Which platforms do you compare?</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    We compare prices from Wolt, Foodora, and UberEats - the three major food
                                    delivery platforms in Finland.
                                </p>
                            </CardContent>
                        </Card>

                        <Card glass>
                            <CardHeader>
                                <h3 className="text-lg font-semibold mb-2">Are the prices accurate?</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    We update our prices regularly to ensure accuracy. However, final prices may
                                    vary based on promotions and availability on the delivery platform.
                                </p>
                            </CardContent>
                        </Card>

                        <Card glass>
                            <CardHeader>
                                <h3 className="text-lg font-semibold mb-2">How do you make money?</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    We earn a small commission when you order through our links. This doesn't
                                    affect your price - you always get the best deal available.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* CTA */}
                <div className="max-w-4xl mx-auto text-center">
                    <Card className="border-2 border-primary/20 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-950/20 dark:to-teal-950/20">
                        <CardHeader>
                            <h3 className="text-2xl font-bold mb-2">Ready to Start Saving?</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-6">
                                Join thousands of smart eaters who save money on every meal
                            </p>
                            <Link href="/">
                                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-teal-500 hover:to-blue-600">
                                    Start Searching Now
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
