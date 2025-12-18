# 🍕 FoodAi - Find the Cheapest Meals in Finland

A Trivago-style price comparison web application for finding the best food deals across Finland. Compare meal prices from multiple delivery platforms and restaurants to save money on every order.

![FoodAi](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-green?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?logo=tailwind-css)

## ✨ Features

### Core Functionality
- **🔍 Smart Search**: Search by keyword (pizza, kebab, sushi, etc.) and filter by city
- **🏷️ Advanced Filters**: 
  - Dietary preferences (vegan, vegetarian, halal, gluten-free)
  - Price range and minimum rating
  - Delivery vs. pickup options
  - Multiple sort options (price, rating, delivery time)
- **💰 Price Comparison**: Compare the same meal across multiple sources
- **📊 Price Tracking**: Historical price data for selected offers
- **🎯 Click Tracking**: Commission/affiliate attribution system (demo)

### User Experience
- **🌙 Dark Mode First**: Beautiful Nordic-inspired design with automatic dark/light mode
- **⚡ Fast Performance**: Optimized loading with skeleton states
- **📱 Fully Responsive**: Works seamlessly on mobile, tablet, and desktop
- **♿ Accessible**: Keyboard navigable with proper ARIA labels
- **🎨 Premium UI**: Glassmorphism effects, smooth animations, and vibrant food photography

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage)
- **Deployment**: [Vercel](https://vercel.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works)
- Git

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/cenk2025/foodai.git
cd foodai
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set Up Supabase

#### Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and create a new project
2. Wait for the database to be provisioned

#### Run Database Migrations

1. In your Supabase project dashboard, go to **SQL Editor**
2. Run the migrations in order:
   - First: `supabase/migrations/20250101000000_initial_schema.sql`
   - Second: `supabase/migrations/20250101000001_seed_data.sql`

#### Create Storage Bucket

1. Go to **Storage** in your Supabase dashboard
2. Create a new bucket named `meal-images`
3. Make it **public**
4. Set policies:
   - Public read access
   - Authenticated write access (for admin)

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` and add your Supabase credentials:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional: DeepSeek AI for smart search suggestions
DEEPSEEK_API_KEY=your-deepseek-api-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

**Where to find your Supabase keys:**
- Go to **Project Settings** → **API**
- `NEXT_PUBLIC_SUPABASE_URL`: Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `anon` `public` key
- `SUPABASE_SERVICE_ROLE_KEY`: `service_role` `secret` key ⚠️ **Never expose this in the browser!**

### 5. Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

\`\`\`
foodai/
├── app/
│   ├── actions/          # Server actions for data fetching
│   ├── compare/          # Price comparison page
│   ├── go/               # Click tracking redirect
│   ├── layout.tsx        # Root layout with SEO
│   ├── page.tsx          # Home page with search
│   └── globals.css       # Global styles and design system
├── components/
│   ├── layout/           # Header, Footer
│   ├── offers/           # Offer cards and lists
│   ├── search/           # Search bar and filters
│   └── ui/               # Reusable UI components
├── lib/
│   ├── supabase/         # Supabase clients (browser, server, service)
│   ├── types/            # TypeScript type definitions
│   └── utils.ts          # Utility functions
├── public/
│   └── images/           # Static images
├── supabase/
│   └── migrations/       # Database schema and seed data
└── README.md
\`\`\`

## 🗄️ Database Schema

### Core Tables

- **cities**: Finnish cities (Helsinki, Espoo, Tampere, etc.)
- **sources**: Delivery platforms and restaurant sites
- **restaurants**: Restaurant information with ratings
- **meals**: Menu items with dietary flags and allergens
- **offers**: Price listings from different sources
- **price_history**: Historical price tracking
- **click_events**: Commission/affiliate click tracking

### Row Level Security (RLS)

- ✅ Public read access for all offer data
- 🔒 Admin-only write access (requires `role: 'admin'` in JWT)
- 🔐 Click events inserted via server-side service role

## 🎨 Design System

### Colors

- **Primary**: Blue (`#3b82f6`) - CTAs and links
- **Accent**: Green (`#10b981`) - Prices and success states
- **Food Colors**: Red, Orange, Yellow for dietary badges
- **Nordic Dark**: Clean dark mode with `#0a0a0a` background

### Typography

- **Font**: Inter (Google Fonts)
- **Weights**: 300-800 for various hierarchy levels

### Components

All components follow a consistent design language:
- Glassmorphism effects for cards
- Smooth transitions and hover effects
- Skeleton loading states
- Accessible focus states

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Import your repository
4. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (your Vercel domain)
5. Deploy!

### Post-Deployment

1. Update `NEXT_PUBLIC_APP_URL` in Vercel environment variables to your production URL
2. Redeploy to apply changes
3. Test the click tracking functionality

## 🔐 Security

### Environment Variables

- ✅ **DO**: Use environment variables for all secrets
- ❌ **DON'T**: Hardcode API keys or expose service role key in browser
- ⚠️ **IMPORTANT**: The service role key bypasses RLS - only use server-side

### RLS Policies

All tables have Row Level Security enabled:
- Public can read active offers
- Only authenticated admins can modify data
- Click events are inserted via server actions using service role

## 📊 Demo Data

The seed script includes:
- 6 Finnish cities
- 4 demo delivery platforms
- 20 restaurants
- 80+ meals with realistic Finnish favorites
- 120+ offers with varied pricing
- Price history for 30 offers

## 🎯 Roadmap

### Phase 1 (Current - Demo)
- ✅ Core search and filtering
- ✅ Price comparison
- ✅ Click tracking
- ✅ Responsive design

### Phase 2 (Future)
- [ ] Real platform integrations (via official APIs)
- [ ] User accounts and saved searches
- [ ] Price alerts and notifications
- [ ] Mobile app (React Native)
- [ ] AI-powered meal recommendations (DeepSeek integration)

### Phase 3 (Advanced)
- [ ] Restaurant partnerships
- [ ] Affiliate program dashboard
- [ ] Analytics and reporting
- [ ] Multi-country support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Design inspiration from Trivago and modern food delivery apps
- Built with Next.js, Supabase, and Tailwind CSS
- Icons by Lucide

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Email: support@foodai.fi (demo)

---

**Note**: This is a demo application. Prices and offers are for demonstration purposes only. For production use, integrate with official platform APIs and comply with their terms of service.
