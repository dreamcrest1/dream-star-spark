import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Defaults that match what we seeded — used as fallback if DB unreachable
export const DEFAULT_SETTINGS: Record<string, any> = {
  header: {
    logoTextPink: 'DREAM',
    logoTextCyan: 'STAR',
    navLinks: [
      { name: 'Home', href: '/' },
      { name: 'Products', href: '/products' },
      { name: 'Contact', href: '/contact' },
      { name: 'Terms', href: '/terms' },
      { name: 'Blog', href: '/blog' },
    ],
  },
  footer: {
    tagline: "India's Most Trusted & Oldest Multi Platform Service Provider",
    customers: '15,000+',
    founded: 2021,
    copyright: '© 2026 Dreamstar Solution. All rights reserved.',
    poweredBy: 'Cosmofeed',
    poweredByUrl: 'https://cosmofeed.com',
  },
  contact: {
    mainPhone: '+91 99914 83279',
    email: 'dreamstarott@gmail.com',
    whatsapp: '919991483279',
    fullAddress: 'D-18 Richmond Heights, Sector 37, Gandhinagar, GJ 382010',
    phones: ['+91 99914 83279', '+91 97292 13279', '+91 91769 00944', '+91 80030 78749'],
  },
  social: {
    instagram: 'https://www.instagram.com/dreamstarsolution',
    youtube: 'https://www.youtube.com/@DreamstarSolution',
    whatsapp: 'https://wa.me/919991483279',
  },
  hero: {
    badge: 'Instant Digital Delivery',
    heading1: 'Premium Digital',
    heading2Pink: 'Products',
    heading2Mid: ' at ',
    heading2Cyan: 'Unreal',
    heading3: 'Prices',
    subheading: 'Access top-tier AI tools, OTT subscriptions, premium software & more.',
    highlight: 'Up to 80% OFF on all digital products.',
    ctaPrimary: 'Explore Products',
    ctaPrimaryHref: '/products',
    ctaSecondary: 'View Categories',
    ctaSecondaryHref: '/categories',
  },
  about: {
    eyebrow: 'About Us',
    titlePink: 'Dreamcrest',
    titleRest: ' Solutions',
    body:
      "Dreamcrest Group is a leading provider of OTT services and group buy tools at discounted prices. Founded in 2021, we've gained over 15,000+ customers and expanded our reach internationally. We're committed to providing genuine digital products at unbeatable prices.",
    features: [
      'Most Trusted Service Provider Since 2021',
      'Genuine Products with Warranty',
      'Instant Digital Delivery',
      'Responsive Customer Support',
    ],
  },
  theme: {
    neonPink: '320 100% 60%',
    neonCyan: '180 100% 50%',
    neonPurple: '280 100% 65%',
    neonOrange: '25 100% 55%',
    background: '270 50% 6%',
    fontDisplay: 'Orbitron',
    fontBody: 'Exo 2',
  },
  seo: {
    siteName: 'Dreamstar Solution',
    defaultTitle: 'Dreamstar Solution – Premium Digital Products at Unreal Prices',
    defaultDescription:
      "India's most trusted provider of OTT subscriptions, AI tools, and premium software at up to 80% off. Instant digital delivery.",
    defaultKeywords: 'OTT India, Netflix, Prime Video, AI tools, software, Dreamstar',
    siteUrl: 'https://dreamstarsolution.com',
    ogImage: 'https://dreamstarsolution.com/og-image.jpg',
  },
};

// In-memory cache so multiple components don't refetch
let cache: Record<string, any> | null = null;
const listeners = new Set<() => void>();

async function fetchAll() {
  const { data, error } = await supabase.from('site_settings').select('key,value');
  if (error || !data) return DEFAULT_SETTINGS;
  const merged: Record<string, any> = { ...DEFAULT_SETTINGS };
  for (const row of data) {
    merged[(row as any).key] = { ...(merged[(row as any).key] || {}), ...((row as any).value || {}) };
  }
  return merged;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<Record<string, any>>(cache || DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    let mounted = true;
    if (!cache) {
      fetchAll().then((s) => {
        cache = s;
        if (mounted) setSettings(s);
        setLoading(false);
        listeners.forEach((l) => l());
      });
    }
    const update = () => cache && setSettings({ ...cache });
    listeners.add(update);
    return () => {
      mounted = false;
      listeners.delete(update);
    };
  }, []);

  return { settings, loading };
}

export async function saveSiteSetting(key: string, value: any) {
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  if (error) throw error;
  cache = { ...(cache || DEFAULT_SETTINGS), [key]: value };
  listeners.forEach((l) => l());
}

export function invalidateSettingsCache() {
  cache = null;
}
