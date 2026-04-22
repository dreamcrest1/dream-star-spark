import { useEffect, useState } from 'react';
import { useBlogs } from '@/hooks/useBlogs';
import { blogs as staticBlogs } from '@/data/blogs';

/**
 * Returns blogs from the database when available, falling back to the static
 * file so existing pages keep working before/while data loads.
 */
export function useBlogsWithFallback() {
  const { blogs, loading } = useBlogs(true);
  const [data, setData] = useState(staticBlogs.map((b) => ({
    id: b.id, slug: b.slug, title: b.title, excerpt: b.excerpt, content: b.content,
    image: b.image, category: b.category, author: b.author, read_time: b.readTime,
    seo_title: null, seo_description: null, published: true, published_at: b.date,
  })));

  useEffect(() => {
    if (!loading && blogs.length > 0) setData(blogs);
  }, [loading, blogs]);

  return { blogs: data, loading };
}
