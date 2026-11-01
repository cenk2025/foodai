import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import AiAssistant from "@/components/ai/AiAssistant";
import "./globals.css";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { LanguageProvider } from "@/lib/i18n/context";

import { LocationProvider } from "@/lib/context/LocationContext";
import AuthHashHandler from "@/components/auth/AuthHashHandler";
import { CartProvider } from "@/lib/direct-ordering/CartContext";
import CartPanel from "@/components/direct-ordering/CartPanel";
import { DIRECT_ORDERING_ENABLED } from "@/lib/features";
import { COMPANY_NAME, SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} – vertaile alennettuja ruokatarjouksia`,
    template: `%s | ${SITE_NAME}`
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL('https://foodai.fi'),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "name": SITE_NAME,
      "url": "https://foodai.fi",
      "inLanguage": "fi",
      "description": SITE_DESCRIPTION,
      "publisher": { "@id": "https://foodai.fi/#organization" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://foodai.fi/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Organization",
      "@id": "https://foodai.fi/#organization",
      "name": COMPANY_NAME,
      "logo": "https://foodai.fi/images/vooniq-logo.png"
    }
  ]
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fi">
      <body className={`${inter.variable} ${jakarta.variable} font-sans antialiased bg-page`} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LanguageProvider>
          <LocationProvider>
            <CartProvider>
              <AuthHashHandler />
              <Header />
              <main className="pb-24 md:pb-0">
                {children}
              </main>
              <BottomNav />
              <AiAssistant />
              {DIRECT_ORDERING_ENABLED && <CartPanel />}
            </CartProvider>
          </LocationProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

