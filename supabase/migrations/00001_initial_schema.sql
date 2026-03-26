-- ==========================================
-- GamePortal Initial Supabase Schema
-- ==========================================

-- 1. Create platforms table
CREATE TABLE public.platforms (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    category text NOT NULL,
    score numeric(3,1) NOT NULL,
    bonus text NOT NULL,
    features text[] NOT NULL DEFAULT '{}',
    tags text[] DEFAULT '{}',
    logo text NOT NULL,
    is_verified boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- 2. Create reviews table
CREATE TABLE public.reviews (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    platform_id uuid REFERENCES public.platforms(id) ON DELETE CASCADE,
    title text NOT NULL,
    date text NOT NULL,
    image text NOT NULL,
    rating numeric(3,1) NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- 3. Create news table
CREATE TABLE public.news (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    excerpt text NOT NULL,
    content text,
    category text NOT NULL,
    date text NOT NULL,
    comments_count integer DEFAULT 0,
    image text NOT NULL,
    is_featured boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- 4. Create collections table
CREATE TABLE public.collections (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text NOT NULL,
    icon_name text NOT NULL,
    color text NOT NULL,
    count integer DEFAULT 0,
    image text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- 5. Create collection_platforms (Join Table for Ranked Lists)
CREATE TABLE public.collection_platforms (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    collection_id uuid REFERENCES public.collections(id) ON DELETE CASCADE,
    platform_id uuid REFERENCES public.platforms(id) ON DELETE CASCADE,
    rank integer NOT NULL,
    created_at timestamptz DEFAULT now(),
    UNIQUE(collection_id, platform_id)
);

-- ==========================================
-- SECURITY & POLICIES (RLS)
-- ==========================================

ALTER TABLE public.platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_platforms ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ ACCESS (Anonymous users can browse the frontend)
CREATE POLICY "Public profiles are viewable by everyone." ON public.platforms FOR SELECT USING (true);
CREATE POLICY "Public reviews are viewable by everyone." ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Public news are viewable by everyone." ON public.news FOR SELECT USING (true);
CREATE POLICY "Public collections are viewable by everyone." ON public.collections FOR SELECT USING (true);
CREATE POLICY "Public collection_platforms are viewable by everyone." ON public.collection_platforms FOR SELECT USING (true);

-- ADMIN WRITE ACCESS (Only authenticated users can modify content via CMS)
CREATE POLICY "Enable insert for authenticated users only" ON public.platforms FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON public.platforms FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON public.platforms FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.reviews FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON public.reviews FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON public.reviews FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.news FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON public.news FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON public.news FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.collections FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON public.collections FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON public.collections FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.collection_platforms FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON public.collection_platforms FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON public.collection_platforms FOR DELETE TO authenticated USING (true);
