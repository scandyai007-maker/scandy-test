# TrustRank - GamePortal

A responsive platform review and ranking portal built with React, TypeScript, Vite, and Supabase.

## Features

- **Platform Reviews** — Detailed reviews with trust scores, features, and SEO-friendly slug URLs
- **Industry News** — Content management with rich text editing and tag-based categorization
- **Curated Collections** — Ranked lists of top platforms
- **Admin CMS** — Full content management powered by Refine + Ant Design
- **SEO Optimized** — Dynamic sitemap.xml, editable robots.txt, meta tags, and slug-based URLs

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Admin**: Refine + Ant Design
- **SEO**: react-helmet-async, dynamic sitemap/robots.txt

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

3. Run the SQL migration scripts in `supabase/` folder on your Supabase instance.

4. Start the dev server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000
