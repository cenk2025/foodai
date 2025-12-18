import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Send, Utensils } from 'lucide-react'
import Button from '../ui/Button'
import Input from '../ui/Input'

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="bg-gradient-to-tr from-blue-600 to-teal-500 p-2 rounded-lg text-white group-hover:scale-110 transition-transform duration-300">
                                <Utensils className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
                                FoodAi
                            </span>
                        </Link>
                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                            Discover the best food deals in Finland. We compare prices across all major platforms to save you money on every delicious bite.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <SocialIcon icon={<Facebook className="w-5 h-5" />} href="#" />
                            <SocialIcon icon={<Twitter className="w-5 h-5" />} href="#" />
                            <SocialIcon icon={<Instagram className="w-5 h-5" />} href="#" />
                            <SocialIcon icon={<Linkedin className="w-5 h-5" />} href="#" />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Discover</h3>
                        <ul className="space-y-3">
                            <FooterLink href="/search?q=pizza">Best Pizza in Helsinki</FooterLink>
                            <FooterLink href="/search?q=sushi">Top Sushi Deals</FooterLink>
                            <FooterLink href="/search?q=burger">Cheap Burgers</FooterLink>
                            <FooterLink href="/search?q=vegan">Vegan Options</FooterLink>
                            <FooterLink href="/restaurants">All Restaurants</FooterLink>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Company</h3>
                        <ul className="space-y-3">
                            <FooterLink href="/about">About Us</FooterLink>
                            <FooterLink href="/careers">Careers</FooterLink>
                            <FooterLink href="/partners">For Restaurants</FooterLink>
                            <FooterLink href="/privacy">Privacy Policy</FooterLink>
                            <FooterLink href="/terms">Terms of Service</FooterLink>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Stay Updated</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
                            Subscribe to get daily food deals and exclusive discounts sent to your inbox.
                        </p>
                        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                            <div className="relative">
                                <Input
                                    placeholder="Enter your email"
                                    type="email"
                                    className="pr-10 bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 focus:ring-blue-500"
                                />
                                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700 p-1">
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-xs text-gray-400">
                                By subscribing, you agree to our Privacy Policy.
                            </p>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        © {new Date().getFullYear()} FoodAi. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
                        <Link href="#" className="hover:text-blue-600 transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-blue-600 transition-colors">Terms</Link>
                        <Link href="#" className="hover:text-blue-600 transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
    return (
        <Link
            href={href}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
        >
            {icon}
        </Link>
    )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <li>
            <Link
                href={href}
                className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
            >
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-zinc-700"></span>
                {children}
            </Link>
        </li>
    )
}
