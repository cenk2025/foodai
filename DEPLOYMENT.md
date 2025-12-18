# 🚀 FoodAi Deployment Guide

This guide will walk you through deploying FoodAi to production using Supabase and Vercel.

## Prerequisites

- [x] GitHub account with the FoodAi repository
- [ ] Supabase account (free tier works)
- [ ] Vercel account (free tier works)

## Step 1: Set Up Supabase

### 1.1 Create a New Project

1. Go to [supabase.com](https://supabase.com/)
2. Click **"New Project"**
3. Fill in the details:
   - **Name**: `foodai` (or your preferred name)
   - **Database Password**: Generate a strong password and save it
   - **Region**: Choose the closest to your users (e.g., `eu-central-1` for Europe)
4. Click **"Create new project"**
5. Wait 2-3 minutes for the database to be provisioned

### 1.2 Run Database Migrations

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Copy the contents of `supabase/migrations/20250101000000_initial_schema.sql`
4. Paste into the SQL editor
5. Click **"Run"** (or press `Cmd/Ctrl + Enter`)
6. Wait for success message

7. Create another new query
8. Copy the contents of `supabase/migrations/20250101000001_seed_data.sql`
9. Paste and run
10. Verify success (should see "Success. No rows returned")

### 1.3 Create Storage Bucket

1. Go to **Storage** in the left sidebar
2. Click **"Create a new bucket"**
3. Configure:
   - **Name**: `meal-images`
   - **Public bucket**: ✅ **Yes** (toggle on)
   - **File size limit**: 5 MB
   - **Allowed MIME types**: `image/jpeg, image/png, image/webp`
4. Click **"Create bucket"**

### 1.4 Get Your API Keys

1. Go to **Project Settings** (gear icon in sidebar)
2. Click **API** in the left menu
3. Copy these values (you'll need them for Vercel):
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️

⚠️ **IMPORTANT**: Never expose the `service_role` key in your browser or client-side code!

## Step 2: Deploy to Vercel

### 2.1 Import Project

1. Go to [vercel.com](https://vercel.com/)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository:
   - If not connected, click **"Import Git Repository"**
   - Authorize Vercel to access your GitHub
   - Select `cenk2025/foodai`
4. Click **"Import"**

### 2.2 Configure Environment Variables

Before deploying, add your environment variables:

1. In the **"Configure Project"** screen, expand **"Environment Variables"**
2. Add the following variables:

| Name | Value | Notes |
|------|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL | From Step 1.4 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | From Step 1.4 |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | From Step 1.4 ⚠️ |
| `NEXT_PUBLIC_APP_URL` | Leave empty for now | We'll add this after deployment |

3. Click **"Deploy"**

### 2.3 Wait for Deployment

- Vercel will build and deploy your app (takes 2-3 minutes)
- You'll see a success screen with your deployment URL
- Example: `https://foodai-xyz123.vercel.app`

### 2.4 Update App URL

1. Copy your Vercel deployment URL
2. Go to **Settings** → **Environment Variables**
3. Add/Update `NEXT_PUBLIC_APP_URL` with your production URL
4. Click **"Save"**
5. Go to **Deployments** tab
6. Click **"Redeploy"** on the latest deployment
7. Select **"Use existing Build Cache"**
8. Click **"Redeploy"**

## Step 3: Verify Deployment

### 3.1 Test the Application

1. Visit your Vercel URL
2. You should see the FoodAi homepage
3. Try searching for "pizza" in "Helsinki"
4. Verify that offers are displayed
5. Click on an offer card
6. Click "Go to Deal" to test click tracking

### 3.2 Check Database

1. Go back to Supabase dashboard
2. Navigate to **Table Editor**
3. Check the `click_events` table
4. You should see a new row after clicking "Go to Deal"

## Step 4: Custom Domain (Optional)

### 4.1 Add Domain in Vercel

1. In your Vercel project, go to **Settings** → **Domains**
2. Click **"Add"**
3. Enter your domain (e.g., `foodai.fi`)
4. Follow Vercel's instructions to configure DNS

### 4.2 Update Environment Variable

1. Once domain is active, update `NEXT_PUBLIC_APP_URL`
2. Change from `https://foodai-xyz123.vercel.app` to `https://foodai.fi`
3. Redeploy

## Step 5: Upload Demo Images (Optional)

To add real food images to your demo:

### 5.1 Prepare Images

1. Collect high-quality food images (JPEG/PNG/WebP)
2. Optimize them (max 500KB each)
3. Name them according to the `image_path` in your database
   - Example: `meals/margherita.jpg`, `meals/pepperoni.jpg`

### 5.2 Upload to Supabase Storage

1. Go to **Storage** → **meal-images** bucket
2. Create a folder called `meals`
3. Upload your images
4. Verify they're publicly accessible

### 5.3 Update Database (if needed)

If you want to change image paths:

\`\`\`sql
UPDATE meals 
SET image_path = 'meals/your-new-image.jpg' 
WHERE name = 'Margherita Pizza';
\`\`\`

## Troubleshooting

### Build Fails

**Error**: `NEXT_PUBLIC_SUPABASE_URL is not defined`
- **Solution**: Check that all environment variables are set in Vercel

**Error**: `Module not found`
- **Solution**: Clear build cache and redeploy

### No Data Showing

**Error**: Empty results on homepage
- **Solution**: 
  1. Check Supabase migrations ran successfully
  2. Verify RLS policies are enabled
  3. Check browser console for errors

### Click Tracking Not Working

**Error**: Clicks not recorded in database
- **Solution**:
  1. Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly
  2. Check that `click_events` table exists
  3. Review server logs in Vercel

### Images Not Loading

**Error**: Placeholder images showing
- **Solution**:
  1. Verify `meal-images` bucket is public
  2. Check image paths in database match Storage
  3. Ensure images are uploaded to correct folder

## Production Checklist

Before going live:

- [ ] All environment variables set correctly
- [ ] Database migrations completed
- [ ] Seed data loaded
- [ ] Storage bucket created and public
- [ ] Test search functionality
- [ ] Test filtering
- [ ] Test click tracking
- [ ] Verify responsive design on mobile
- [ ] Check performance (Lighthouse score)
- [ ] Set up custom domain (optional)
- [ ] Configure analytics (optional)

## Monitoring

### Vercel Analytics

1. Go to **Analytics** tab in Vercel
2. Monitor page views, performance, and errors

### Supabase Monitoring

1. Go to **Database** → **Logs**
2. Monitor query performance
3. Check for errors

## Updating the App

To deploy updates:

1. Make changes locally
2. Commit to git: `git commit -am "Your changes"`
3. Push to GitHub: `git push origin main`
4. Vercel will automatically deploy

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check Supabase logs
3. Review browser console errors
4. Open an issue on GitHub

## Security Notes

⚠️ **NEVER** commit these to git:
- `.env.local`
- Service role keys
- Database passwords

✅ **ALWAYS**:
- Use environment variables
- Keep service role key server-side only
- Enable RLS policies
- Use HTTPS in production

---

**Congratulations!** 🎉 Your FoodAi app is now live!

Visit your deployment URL and start comparing food prices!
