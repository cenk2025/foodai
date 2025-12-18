import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "FoodAi - Find the Cheapest Meals in Finland",
  description: "Compare food prices from multiple delivery platforms and restaurants across Finland. Find the best deals on pizza, kebab, sushi, and more in Helsinki, Espoo, Tampere, and other cities.",
  keywords: ["food delivery", "price comparison", "Finland", "Helsinki", "cheap food", "restaurant deals"],
  authors: [{ name: "FoodAi" }],
  openGraph: {
    title: "FoodAi - Find the Cheapest Meals in Finland",
    description: "Compare food prices and save money on every order",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}

