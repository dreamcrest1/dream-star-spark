import { supabase } from '@/integrations/supabase/client';

const VISITOR_KEY = 'dss_visitor_id';

function getVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return 'anonymous';
  }
}

function detectDevice(): string {
  const ua = navigator.userAgent;
  if (/iPad|Tablet/i.test(ua)) return 'tablet';
  if (/Mobi|Android|iPhone/i.test(ua)) return 'mobile';
  return 'desktop';
}

export function trackProductClick(product: { id: number | string; name: string }) {
  try {
    supabase
      .from('product_clicks')
      .insert({
        product_id: typeof product.id === 'string' ? Number(product.id) : product.id,
        product_name: product.name,
        visitor_id: getVisitorId(),
        source_path: window.location.pathname,
        device: detectDevice(),
      })
      .then(() => {});
  } catch {
    // silent
  }
}

export { detectDevice, getVisitorId };
