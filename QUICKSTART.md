# 🚀 Quick Start Guide

Get FoodAi running locally in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm installed
- A Supabase account (free)

## Step 1: Clone & Install (1 min)

\`\`\`bash
git clone https://github.com/cenk2025/foodai.git
cd foodai
npm install
\`\`\`

## Step 2: Set Up Supabase (2 min)

### Create Project
1. Go to [supabase.com](https://supabase.com/) → New Project
2. Wait for database to provision

### Run Migrations
1. Go to **SQL Editor** in Supabase dashboard
2. Run `supabase/migrations/20250101000000_initial_schema.sql`
3. Run `supabase/migrations/20250101000001_seed_data.sql`

### Create Storage Bucket
1. Go to **Storage** → Create bucket
2. Name: `meal-images`
3. Make it **public**

### Get API Keys
1. **Settings** → **API**
2. Copy:
   - Project URL
   - anon public key
   - service_role secret key

## Step 3: Configure Environment (1 min)

Create `.env.local`:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` with your Supabase keys:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

## Step 4: Run! (1 min)

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) 🎉

## What You'll See

- **Homepage**: Search bar with city selector
- **Demo Data**: 
  - 6 cities (Helsinki, Espoo, Tampere, etc.)
  - 20 restaurants
  - 80+ meals
  - 120+ offers

## Try It Out

1. Search for "pizza" in "Helsinki"
2. Apply filters (vegan, max price, etc.)
3. Click on an offer card
4. Click "Go to Deal" (redirects to demo URL)

## Next Steps

- Read [README.md](README.md) for full documentation
- See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Customize the design in `app/globals.css`
- Add more seed data in `supabase/migrations/`

## Common Issues

### "No offers found"
- Check that seed data migration ran successfully
- Verify Supabase URL and keys are correct

### Images not loading
- Create the `meal-images` bucket in Supabase Storage
- Make sure it's set to public

### Build errors
- Run `npm install` again
- Clear `.next` folder: `rm -rf .next`

## Development Tips

### Hot Reload
Changes to code will auto-reload in browser

### Database Changes
After modifying database:
1. Update types in `lib/types/database.ts`
2. Update server actions in `app/actions/`

### Styling
- Global styles: `app/globals.css`
- Component styles: Tailwind classes
- Design tokens: CSS variables in `:root`

## Project Structure

\`\`\`
foodai/
├── app/              # Next.js pages and routes
├── components/       # React components
├── lib/              # Utilities and types
├── public/           # Static assets
└── supabase/         # Database migrations
\`\`\`

## Available Scripts

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
\`\`\`

## Need Help?

- Check the [README.md](README.md)
- Review [DEPLOYMENT.md](DEPLOYMENT.md)
- Open an issue on GitHub

---

**Happy coding!** 🚀
