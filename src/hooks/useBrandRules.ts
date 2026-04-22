import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface BrandRule {
  id: number;
  pattern: string;
  domain: string;
  priority: number;
  notes: string | null;
}

let rulesCache: BrandRule[] | null = null;

export async function loadBrandRules(): Promise<BrandRule[]> {
  if (rulesCache) return rulesCache;
  const { data } = await supabase.from('brand_rules').select('*').order('priority', { ascending: true });
  rulesCache = (data as BrandRule[]) || [];
  return rulesCache;
}

export function invalidateBrandRulesCache() {
  rulesCache = null;
}

export function useBrandRules() {
  const [rules, setRules] = useState<BrandRule[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    invalidateBrandRulesCache();
    const r = await loadBrandRules();
    setRules(r);
    setLoading(false);
  };

  useEffect(() => {
    reload();
  }, []);

  return { rules, loading, reload };
}

const FALLBACK = '/placeholder.svg';

export function brandLogoFromRules(name: string | null | undefined, rules: BrandRule[]): string {
  if (!name) return FALLBACK;
  for (const r of rules) {
    try {
      if (new RegExp(r.pattern, 'i').test(name)) {
        return `https://www.google.com/s2/favicons?domain=${r.domain}&sz=256`;
      }
    } catch {
      // Skip invalid regex patterns
    }
  }
  return FALLBACK;
}
