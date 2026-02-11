-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Owner Profile Table
CREATE TABLE IF NOT EXISTS public.owner_profile (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action_type TEXT NOT NULL,
  description TEXT,
  entity_type TEXT,
  entity_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Visitor Analytics Table
CREATE TABLE IF NOT EXISTS public.visitor_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page_path TEXT NOT NULL,
  visitor_id TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RLS Policies
ALTER TABLE public.owner_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_analytics ENABLE ROW LEVEL SECURITY;

-- Owner Profile Policies
CREATE POLICY "Allow public read access to owner_profile" ON public.owner_profile FOR SELECT USING (true);
CREATE POLICY "Allow authenticated update to owner_profile" ON public.owner_profile FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert to owner_profile" ON public.owner_profile FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Audit Logs Policies
CREATE POLICY "Allow authenticated read access to audit_logs" ON public.audit_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert to audit_logs" ON public.audit_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Analytics Policies
CREATE POLICY "Allow public insert to visitor_analytics" ON public.visitor_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated read access to visitor_analytics" ON public.visitor_analytics FOR SELECT USING (auth.role() = 'authenticated');

-- Storage Bucket for Owner Images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('owner-images', 'owner-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access Owner Images" ON storage.objects FOR SELECT USING (bucket_id = 'owner-images');
CREATE POLICY "Authenticated Upload Owner Images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'owner-images' AND auth.role() = 'authenticated');

-- Site Settings Updates (Background Customization)
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS hero_bg_type TEXT DEFAULT 'image',
ADD COLUMN IF NOT EXISTS hero_bg_value TEXT,
ADD COLUMN IF NOT EXISTS hero_blur INTEGER DEFAULT 0;

-- Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to categories" ON public.categories;
CREATE POLICY "Allow public read access to categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated all access to categories" ON public.categories;
CREATE POLICY "Allow authenticated all access to categories" ON public.categories FOR ALL USING (auth.role() = 'authenticated');

-- Insert defaults
INSERT INTO public.categories (name) VALUES 
('Commercial'), ('Residential'), ('Windows & Doors'), ('Office Partitioning'), ('Shower Cubicles')
ON CONFLICT (name) DO NOTHING;

-- Update Site Settings with Company Info
UPDATE public.site_settings
SET 
  company_name = 'Jumba Glass & Aluminium Fabricators',
  address = 'P.O. Box 14309-20100, Nakuru',
  phone_primary = '0721 471 764 / 0777 471 764',
  email_primary = 'bmlugogo21@gmail.com';

-- Insert new categories
INSERT INTO public.categories (name) VALUES 
('Aluminium Sliding Doors/Windows'), 
('Wall Curtaining System'), 
('Koller Doors'), 
('Cabinets'), 
('Counters'), 
('Wood Works'), 
('Plumbing'), 
('Tiles Fitting')
ON CONFLICT (name) DO NOTHING;
