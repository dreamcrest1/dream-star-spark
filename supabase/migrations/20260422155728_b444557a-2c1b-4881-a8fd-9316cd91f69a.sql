
-- Products table
CREATE TABLE public.products (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  sale_price NUMERIC,
  regular_price NUMERIC NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  external_url TEXT NOT NULL DEFAULT '',
  button_text TEXT NOT NULL DEFAULT 'Buy Now',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public can read products
CREATE POLICY "products_select_public" ON public.products
  FOR SELECT USING (true);

-- Anyone can write (admin uses hardcoded password client-side per user choice)
CREATE POLICY "products_insert_public" ON public.products
  FOR INSERT WITH CHECK (true);
CREATE POLICY "products_update_public" ON public.products
  FOR UPDATE USING (true);
CREATE POLICY "products_delete_public" ON public.products
  FOR DELETE USING (true);

-- Page views analytics
CREATE TABLE public.page_views (
  id BIGSERIAL PRIMARY KEY,
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  visitor_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "page_views_insert_public" ON public.page_views
  FOR INSERT WITH CHECK (true);
CREATE POLICY "page_views_select_public" ON public.page_views
  FOR SELECT USING (true);

CREATE INDEX idx_page_views_created_at ON public.page_views(created_at DESC);
CREATE INDEX idx_page_views_path ON public.page_views(path);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER products_set_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
