/**
 * Homepage section ordering / visibility, persisted in site_settings('home_layout').
 * Each entry: { id, enabled }. Order of array = render order.
 */
import { useSiteSettings } from '@/hooks/useSiteSettings';

export type SectionId = 'hero' | 'categories' | 'featured' | 'blog' | 'about';

export interface SectionConfig {
  id: SectionId;
  enabled: boolean;
}

export const SECTION_META: Record<SectionId, { label: string; description: string }> = {
  hero: { label: 'Hero', description: 'Main headline + video background + CTAs' },
  categories: { label: 'Categories', description: 'Category cards row' },
  featured: { label: 'Featured Products', description: 'Top product grid' },
  blog: { label: 'Blog Section', description: 'Latest blog posts strip' },
  about: { label: 'About', description: 'About + stats + features block' },
};

export const DEFAULT_LAYOUT: SectionConfig[] = [
  { id: 'hero', enabled: true },
  { id: 'categories', enabled: true },
  { id: 'featured', enabled: true },
  { id: 'blog', enabled: true },
  { id: 'about', enabled: true },
];

/**
 * Read the current home layout, falling back to defaults and merging in any
 * new sections that didn't exist when the user last saved.
 */
export function useHomeLayout(): SectionConfig[] {
  const { settings } = useSiteSettings();
  const stored: SectionConfig[] | undefined = (settings.home_layout as any)?.sections;
  if (!Array.isArray(stored) || stored.length === 0) return DEFAULT_LAYOUT;

  const seen = new Set(stored.map((s) => s.id));
  const merged = [...stored.filter((s) => SECTION_META[s.id])];
  for (const def of DEFAULT_LAYOUT) {
    if (!seen.has(def.id)) merged.push(def);
  }
  return merged;
}
