import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface BlogRow {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  read_time: string;
  seo_title: string | null;
  seo_description: string | null;
  published: boolean;
  published_at: string;
}

export function useBlogs(onlyPublished = true) {
  const [blogs, setBlogs] = useState<BlogRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let q = supabase.from('blogs').select('*').order('published_at', { ascending: false });
      if (onlyPublished) q = q.eq('published', true);
      const { data } = await q;
      setBlogs((data as BlogRow[]) || []);
      setLoading(false);
    })();
  }, [onlyPublished]);

  return { blogs, loading };
}

export function useBlog(slug: string | undefined) {
  const [blog, setBlog] = useState<BlogRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data } = await supabase.from('blogs').select('*').eq('slug', slug).maybeSingle();
      setBlog((data as BlogRow) || null);
      setLoading(false);
    })();
  }, [slug]);

  return { blog, loading };
}
