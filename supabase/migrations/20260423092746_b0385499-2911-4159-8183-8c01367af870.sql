-- Product click tracking
CREATE TABLE IF NOT EXISTS public.product_clicks (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT,
  product_name TEXT,
  visitor_id TEXT,
  source_path TEXT,
  device TEXT,
  country TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.product_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "product_clicks_insert_public" ON public.product_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "product_clicks_select_public" ON public.product_clicks FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS idx_product_clicks_created ON public.product_clicks (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_clicks_product ON public.product_clicks (product_id);

-- Add device + country to page_views
ALTER TABLE public.page_views ADD COLUMN IF NOT EXISTS device TEXT;
ALTER TABLE public.page_views ADD COLUMN IF NOT EXISTS country TEXT;
CREATE INDEX IF NOT EXISTS idx_page_views_created ON public.page_views (created_at DESC);