-- Site settings: single-row-per-key JSON store
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY site_settings_select_public ON public.site_settings FOR SELECT USING (true);
CREATE POLICY site_settings_insert_public ON public.site_settings FOR INSERT WITH CHECK (true);
CREATE POLICY site_settings_update_public ON public.site_settings FOR UPDATE USING (true);
CREATE POLICY site_settings_delete_public ON public.site_settings FOR DELETE USING (true);

CREATE TRIGGER site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Blogs
CREATE TABLE public.blogs (
  id bigserial PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  image text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'General',
  author text NOT NULL DEFAULT 'Dreamstar Team',
  read_time text NOT NULL DEFAULT '3 min',
  seo_title text,
  seo_description text,
  published boolean NOT NULL DEFAULT true,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
CREATE POLICY blogs_select_public ON public.blogs FOR SELECT USING (true);
CREATE POLICY blogs_insert_public ON public.blogs FOR INSERT WITH CHECK (true);
CREATE POLICY blogs_update_public ON public.blogs FOR UPDATE USING (true);
CREATE POLICY blogs_delete_public ON public.blogs FOR DELETE USING (true);
CREATE TRIGGER blogs_updated_at BEFORE UPDATE ON public.blogs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_blogs_published_at ON public.blogs (published_at DESC);

-- Brand rules: priority-ordered match patterns -> domain
CREATE TABLE public.brand_rules (
  id bigserial PRIMARY KEY,
  pattern text NOT NULL,
  domain text NOT NULL,
  priority int NOT NULL DEFAULT 100,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.brand_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY brand_rules_select_public ON public.brand_rules FOR SELECT USING (true);
CREATE POLICY brand_rules_insert_public ON public.brand_rules FOR INSERT WITH CHECK (true);
CREATE POLICY brand_rules_update_public ON public.brand_rules FOR UPDATE USING (true);
CREATE POLICY brand_rules_delete_public ON public.brand_rules FOR DELETE USING (true);
CREATE TRIGGER brand_rules_updated_at BEFORE UPDATE ON public.brand_rules FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_brand_rules_priority ON public.brand_rules (priority);

-- Media library
CREATE TABLE public.media (
  id bigserial PRIMARY KEY,
  url text NOT NULL,
  path text NOT NULL,
  name text NOT NULL DEFAULT '',
  mime_type text,
  size_bytes bigint,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
CREATE POLICY media_select_public ON public.media FOR SELECT USING (true);
CREATE POLICY media_insert_public ON public.media FOR INSERT WITH CHECK (true);
CREATE POLICY media_delete_public ON public.media FOR DELETE USING (true);

-- Media storage bucket (public read)
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "media_public_read" ON storage.objects
FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "media_public_insert" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'media');

CREATE POLICY "media_public_delete" ON storage.objects
FOR DELETE USING (bucket_id = 'media');