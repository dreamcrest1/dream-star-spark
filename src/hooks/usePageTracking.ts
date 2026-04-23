import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { detectDevice, getVisitorId } from '@/lib/trackClick';

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    // Don't track admin pages
    if (location.pathname.startsWith('/admin')) return;

    const visitor_id = getVisitorId();
    supabase
      .from('page_views')
      .insert({
        path: location.pathname,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        visitor_id,
        device: detectDevice(),
      })
      .then(() => {});
  }, [location.pathname]);
}
