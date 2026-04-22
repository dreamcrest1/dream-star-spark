import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
      })
      .then(() => {});
  }, [location.pathname]);
}
