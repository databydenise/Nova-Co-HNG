# NOVA & CO. — Full-Stack E-Commerce Storefront MVP

> "Thoughtfully chosen. Made for everyday life."

NOVA & CO. is a small-business Nigerian boutique storefront selling clothing, leather bags, accessories and lifestyle pieces, priced in Nigerian Naira (₦). It's an internship MVP showing a cloud-native e-commerce setup with **Vite, React, Tailwind CSS, Supabase, Google OAuth and Mailgun**.

## Tech Stack
- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS (custom emerald / jade / sage palette)
- **Icons:** Lucide React
- **Backend & DB:** Supabase (PostgreSQL, Row-Level Security, Edge Functions)
- **Auth:** Supabase Auth (Google OAuth 2.0)
- **Emails:** Mailgun HTTP API via a Supabase Deno Edge Function
- **Deploy:** Vercel (SPA rewrites in `vercel.json`)

## Setup

### 1. Supabase
1. Create a free project at [supabase.com](https://supabase.com).
2. In the **SQL Editor**, run `supabase/migrations/20261002000000_schema.sql`.
3. Copy your project **URL** and **anon / publishable key** from **Project Settings > API**.

### 2. Google OAuth
1. In [Google Cloud Console](https://console.cloud.google.com), create a project and configure the **OAuth consent screen**.
2. Create an **OAuth 2.0 Client ID** (Web application).
3. Add this to **Authorized redirect URIs**: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
4. Paste the Client ID and Secret into **Supabase > Authentication > Providers > Google**.

### 3. Mailgun + Edge Function (optional)
1. Sign up at [mailgun.com](https://mailgun.com) and grab your API key and sending domain. Verify DNS, or use sandbox mode with authorized test recipients.
2. Deploy the function:
   ```bash
   supabase functions deploy send-email --no-verify-jwt
   ```
3. Set the secrets:
   ```bash
   supabase secrets set MAILGUN_API_KEY=your_mailgun_api_key
   supabase secrets set MAILGUN_DOMAIN=your_domain.com
   supabase secrets set MAILGUN_FROM_EMAIL="NOVA & CO. <mail@your_domain.com>"
   ```

### 4. Run locally
```bash
cp .env.example .env     # then fill in your Supabase URL + key
npm install
npm run dev
```

### 5. Deploy to Vercel
1. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial NOVA & CO. storefront commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/nova-and-co.git
   git push -u origin main
   ```
2. Import the repo on [vercel.com](https://vercel.com).
3. Add env vars `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
4. Deploy.

## Fastest 2-Hour Path
| Time | Task |
|------|------|
| 0:00 – 0:20 | Create Supabase project, run the SQL migration |
| 0:20 – 0:45 | Set up Google OAuth, enable it in Supabase |
| 0:45 – 1:10 | Add `.env`, run `npm run dev`, test listings and cart |
| 1:10 – 1:35 | Deploy the email Edge Function + secrets (optional) |
| 1:35 – 2:00 | Push to GitHub, deploy on Vercel |
