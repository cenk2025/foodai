'use client'

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Send, Utensils, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/context'

export default function Footer() {
    const { t } = useLanguage()

    return (
        <footer className="bg-[#3d1d11] pt-24 pb-12 font-outfit text-white overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#d35400]/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#f3d179]/5 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    {/* Brand Column */}
                    <div className="space-y-8">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-12 h-12 rounded-2xl bg-[#d35400] flex items-center justify-center shadow-xl transform group-hover:rotate-6 transition-transform">
                                <Utensils className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-3xl font-black tracking-tight text-white">
                                Food<span className="text-[#f3d179]">AI</span>
                            </span>
                        </Link>
                        <p className="text-[#a08a7e] font-medium leading-relaxed max-w-xs">
                            {t.footer.desc}
                        </p>
                        <div className="flex gap-4">
                            <SocialIcon icon={<Facebook className="w-5 h-5" />} href="#" />
                            <SocialIcon icon={<Instagram className="w-5 h-5" />} href="#" />
                            <SocialIcon icon={<Twitter className="w-5 h-5" />} href="#" />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#f3d179] mb-8">{t.footer.discover}</h3>
                        <ul className="space-y-4">
                            <FooterLink href="/search?q=pizza">Parhaat Pizzat</FooterLink>
                            <FooterLink href="/search?q=sushi">Sushitarjoukset</FooterLink>
                            <FooterLink href="/search?q=burger">Edulliset Burgerit</FooterLink>
                            <FooterLink href="/favorites">Omat Suosikit</FooterLink>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#f3d179] mb-8">{t.footer.company}</h3>
                        <ul className="space-y-4">
                            <FooterLink href="/about">{t.footer.links.about}</FooterLink>
                            <FooterLink href="/how-it-works">Miten se toimii?</FooterLink>
                            <FooterLink href="/partners">{t.footer.links.partners}</FooterLink>
                            <FooterLink href="/privacy">{t.footer.links.privacy}</FooterLink>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#f3d179] mb-8">{t.footer.stay_updated}</h3>
                        <p className="text-[#a08a7e] font-medium mb-6 text-sm">
                            {t.footer.newsletter_desc}
                        </p>
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div className="relative group">
                                <input
                                    placeholder={t.footer.email_placeholder}
                                    type="email"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-[#f3d179] transition-all font-medium placeholder:text-white/20"
                                />
                                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#f3d179] rounded-xl flex items-center justify-center text-[#3d1d11] hover:bg-white hover:scale-105 transition-all shadow-lg active:scale-95">
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-[10px] text-[#a08a7e] font-medium italic">
                                Tilaamalla hyväksyt tietosuojaselosteemme.
                            </p>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-xs font-medium text-[#a08a7e]">
                        © {new Date().getFullYear()} FoodAi. {t.footer.rights}
                    </p>
                    <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-white/40">
                        <Link href="/privacy" className="hover:text-[#f3d179] transition-colors">{t.footer.links.privacy}</Link>
                        <Link href="/terms" className="hover:text-[#f3d179] transition-colors">{t.footer.links.terms}</Link>
                        <Link href="/cookies" className="hover:text-[#f3d179] transition-colors">Evästeet</Link>
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
            className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/60 hover:bg-[#d35400] hover:text-white hover:rotate-6 transition-all duration-300 border border-white/5"
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
                className="text-[#a08a7e] hover:text-white transition-all flex items-center gap-2 group font-medium text-sm"
            >
                <ChevronRight className="w-3 h-3 text-[#f3d179] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                {children}
            </Link>
        </li>
    )
}
