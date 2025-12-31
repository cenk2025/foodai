'use client'

import Link from 'next/link'
import { ArrowLeft, Search, Filter, ShoppingCart, TrendingDown, Zap, Shield, Heart } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card, { CardHeader, CardContent } from '@/components/ui/Card'
import { useLanguage } from '@/lib/i18n/context'

export default function HowItWorksPage() {
    const { t } = useLanguage()

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-12">
                {/* Back Button */}
                <Link href="/">
                    <Button variant="ghost" className="mb-8">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t.common.back_to_home}
                    </Button>
                </Link>

                {/* Hero */}
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        {t.how_it_works.title} <span className="gradient-text">{t.how_it_works.title_highlight}</span> {t.how_it_works.title_end}
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        {t.how_it_works.subtitle}
                    </p>
                </div>

                {/* How It Works Steps */}
                <div className="max-w-4xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-center mb-12">{t.how_it_works.steps_title}</h2>
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
                                            <h3 className="text-xl font-semibold">{t.how_it_works.step1_title}</h3>
                                        </div>
                                        <p className="text-muted-foreground">
                                            {t.how_it_works.step1_desc}
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
                                            <h3 className="text-xl font-semibold">{t.how_it_works.step2_title}</h3>
                                        </div>
                                        <p className="text-muted-foreground">
                                            {t.how_it_works.step2_desc}
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
                                            <h3 className="text-xl font-semibold">{t.how_it_works.step3_title}</h3>
                                        </div>
                                        <p className="text-muted-foreground">
                                            {t.how_it_works.step3_desc}
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    </div>
                </div>

                {/* Key Features */}
                <div className="max-w-6xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-center mb-12">{t.how_it_works.why_title}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card hover>
                            <CardHeader>
                                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                                    <TrendingDown className="w-6 h-6 text-accent" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{t.how_it_works.feature1_title}</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    {t.how_it_works.feature1_desc}
                                </p>
                            </CardContent>
                        </Card>

                        <Card hover>
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                    <Zap className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{t.how_it_works.feature2_title}</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    {t.how_it_works.feature2_desc}
                                </p>
                            </CardContent>
                        </Card>

                        <Card hover>
                            <CardHeader>
                                <div className="w-12 h-12 bg-food-orange/10 rounded-lg flex items-center justify-center mb-4">
                                    <Shield className="w-6 h-6 text-food-orange" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{t.how_it_works.feature3_title}</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    {t.how_it_works.feature3_desc}
                                </p>
                            </CardContent>
                        </Card>

                        <Card hover>
                            <CardHeader>
                                <div className="w-12 h-12 bg-food-green/10 rounded-lg flex items-center justify-center mb-4">
                                    <Heart className="w-6 h-6 text-food-green" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{t.how_it_works.feature4_title}</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    {t.how_it_works.feature4_desc}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-4xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-center mb-12">{t.how_it_works.faq_title}</h2>
                    <div className="space-y-4">
                        <Card glass>
                            <CardHeader>
                                <h3 className="text-lg font-semibold mb-2">{t.how_it_works.faq1_q}</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    {t.how_it_works.faq1_a}
                                </p>
                            </CardContent>
                        </Card>

                        <Card glass>
                            <CardHeader>
                                <h3 className="text-lg font-semibold mb-2">{t.how_it_works.faq2_q}</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    {t.how_it_works.faq2_a}
                                </p>
                            </CardContent>
                        </Card>

                        <Card glass>
                            <CardHeader>
                                <h3 className="text-lg font-semibold mb-2">{t.how_it_works.faq3_q}</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    {t.how_it_works.faq3_a}
                                </p>
                            </CardContent>
                        </Card>

                        <Card glass>
                            <CardHeader>
                                <h3 className="text-lg font-semibold mb-2">{t.how_it_works.faq4_q}</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    {t.how_it_works.faq4_a}
                                </p>
                            </CardContent>
                        </Card>

                        <Card glass>
                            <CardHeader>
                                <h3 className="text-lg font-semibold mb-2">{t.how_it_works.faq5_q}</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    {t.how_it_works.faq5_a}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* CTA */}
                <div className="max-w-4xl mx-auto text-center">
                    <Card className="border-2 border-primary/20 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-950/20 dark:to-teal-950/20">
                        <CardHeader>
                            <h3 className="text-2xl font-bold mb-2">{t.how_it_works.cta_title}</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-6">
                                {t.how_it_works.cta_subtitle}
                            </p>
                            <Link href="/">
                                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-teal-500 hover:to-blue-600">
                                    {t.how_it_works.cta_button}
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
