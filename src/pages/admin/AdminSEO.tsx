import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertTriangle, XCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from './AdminLayout';

interface RouteCheck {
  path: string;
  label: string;
  url: string;
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  twitterCard: string;
  h1Count: number;
  h1Text: string;
  noindex: boolean;
  status: 'ok' | 'warn' | 'error';
  issues: string[];
  loading: boolean;
}

async function discoverRoutes(): Promise<{ path: string; label: string }[]> {
  const base: { path: string; label: string }[] = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products list' },
    { path: '/categories', label: 'Categories' },
    { path: '/contact', label: 'Contact' },
    { path: '/terms', label: 'Terms' },
    { path: '/blog', label: 'Blog index' },
  ];
  const { data: blogs } = await supabase.from('blogs').select('slug,title').eq('published', true).limit(50);
  for (const b of blogs || []) base.push({ path: `/blog/${(b as any).slug}`, label: `Blog: ${(b as any).title}` });
  const { data: prods } = await supabase.from('products').select('id,name').limit(20);
  for (const p of prods || []) base.push({ path: `/product/${(p as any).id}`, label: `Product: ${(p as any).name}` });
  return base;
}

// Render the route in a hidden iframe, wait for Helmet to populate the head, then read it.
function checkRouteInIframe(path: string, label: string, siteUrl: string, container: HTMLElement): Promise<RouteCheck> {
  return new Promise((resolve) => {
    const url = `${siteUrl.replace(/\/$/, '')}${path}`;
    const issues: string[] = [];
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:absolute;width:1024px;height:768px;left:-9999px;top:-9999px;border:0;';
    iframe.src = path;
    container.appendChild(iframe);

    const timeout = window.setTimeout(() => finish(), 8000);

    const finish = () => {
      window.clearTimeout(timeout);
      try {
        const doc = iframe.contentDocument;
        if (!doc) throw new Error('Iframe document unavailable');
        const head = doc.head;
        const body = doc.body;
        const get = (sel: string, attr = 'content') =>
          (head.querySelector(sel) as HTMLMetaElement | HTMLLinkElement | null)?.getAttribute(attr) || '';

        const title = doc.title || '';
        const description = get('meta[name="description"]');
        const canonical = get('link[rel="canonical"]', 'href');
        const ogTitle = get('meta[property="og:title"]');
        const ogDescription = get('meta[property="og:description"]');
        const ogImage = get('meta[property="og:image"]');
        const ogType = get('meta[property="og:type"]');
        const twitterCard = get('meta[name="twitter:card"]');
        const robots = get('meta[name="robots"]');
        const h1s = body?.querySelectorAll('h1') || ([] as any);
        const h1Count = h1s.length;
        const h1Text = (h1s[0] as HTMLElement | undefined)?.innerText.trim() || '';

        if (!title) issues.push('Missing <title>');
        else if (title.length < 10) issues.push(`Title too short (${title.length} chars)`);
        else if (title.length > 70) issues.push(`Title too long (${title.length} chars, recommended ≤60)`);
        if (!description) issues.push('Missing meta description');
        else if (description.length < 50) issues.push(`Description too short (${description.length} chars)`);
        else if (description.length > 170) issues.push(`Description too long (${description.length} chars, recommended ≤160)`);
        if (!canonical) issues.push('Missing canonical link');
        if (!ogTitle) issues.push('Missing og:title');
        if (!ogDescription) issues.push('Missing og:description');
        if (!ogImage) issues.push('Missing og:image');
        if (!twitterCard) issues.push('Missing twitter:card');
        if (h1Count === 0) issues.push('No <h1> on page');
        else if (h1Count > 1) issues.push(`${h1Count} <h1> tags (should be exactly 1)`);

        const noindex = /noindex/i.test(robots);
        const status: 'ok' | 'warn' | 'error' = issues.length === 0 ? 'ok' : issues.length <= 2 ? 'warn' : 'error';

        resolve({
          path, label, url,
          title, description, canonical, ogTitle, ogDescription, ogImage, ogType, twitterCard,
          h1Count, h1Text, noindex, status, issues, loading: false,
        });
      } catch (e: any) {
        resolve({
          path, label, url, title: '', description: '', canonical: '', ogTitle: '', ogDescription: '',
          ogImage: '', ogType: '', twitterCard: '', h1Count: 0, h1Text: '', noindex: false,
          status: 'error', issues: [`Could not read iframe head: ${e.message}`], loading: false,
        });
      } finally {
        try { container.removeChild(iframe); } catch { /* noop */ }
      }
    };

    iframe.addEventListener('load', () => {
      // Wait for Helmet to hydrate the head, then read.
      window.setTimeout(finish, 1500);
    });
  });
}

const StatusIcon = ({ status }: { status: 'ok' | 'warn' | 'error' }) => {
  if (status === 'ok') return <CheckCircle2 className="w-4 h-4 text-green-400" />;
  if (status === 'warn') return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
  return <XCircle className="w-4 h-4 text-destructive" />;
};

const AdminSEO = () => {
  const { toast } = useToast();
  const [results, setResults] = useState<RouteCheck[]>([]);
  const [loading, setLoading] = useState(false);
  const [siteUrl] = useState(window.location.origin);
  const containerRef = useRef<HTMLDivElement>(null);

  const run = async () => {
    if (!containerRef.current) return;
    setLoading(true);
    setResults([]);
    const routes = await discoverRoutes();
    const out: RouteCheck[] = [];
    for (const r of routes) {
      const c = await checkRouteInIframe(r.path, r.label, siteUrl, containerRef.current);
      out.push(c);
      setResults([...out]);
    }
    setLoading(false);
    toast({ title: 'Audit complete', description: `Checked ${out.length} routes` });
  };

  useEffect(() => { run(); /* eslint-disable-next-line */ }, []);

  const okCount = results.filter((r) => r.status === 'ok').length;
  const warnCount = results.filter((r) => r.status === 'warn').length;
  const errCount = results.filter((r) => r.status === 'error').length;

  return (
    <AdminLayout title="SEO Audit">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-4">
          <div className="text-sm"><CheckCircle2 className="inline w-4 h-4 text-green-400 mr-1" />{okCount} OK</div>
          <div className="text-sm"><AlertTriangle className="inline w-4 h-4 text-yellow-400 mr-1" />{warnCount} Warnings</div>
          <div className="text-sm"><XCircle className="inline w-4 h-4 text-destructive mr-1" />{errCount} Errors</div>
        </div>
        <Button onClick={run} disabled={loading}><RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />Re-run audit</Button>
      </div>

      <Card className="p-4 mb-6 bg-muted/30">
        <p className="text-xs text-muted-foreground">
          ℹ️ This audit renders each route in a hidden iframe and reads the live <code>&lt;head&gt;</code> after
          react-helmet hydrates — exactly what real users and modern crawlers (Google/Bing) see. Each route gets
          ~1.5s to render. For non-JS crawlers, consider server-side prerendering.
        </p>
      </Card>

      <div ref={containerRef} aria-hidden />

      <div className="space-y-3">
        {results.map((r) => (
          <Card key={r.path} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <StatusIcon status={r.status} />
                <span className="font-mono text-sm">{r.path}</span>
                <span className="text-xs text-muted-foreground truncate">{r.label}</span>
                {r.noindex && <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400">noindex</span>}
              </div>
              <a href={r.url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                Open <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 text-xs">
              <div><span className="text-muted-foreground">Title ({r.title.length}): </span>{r.title || <em className="text-destructive">missing</em>}</div>
              <div><span className="text-muted-foreground">H1 ({r.h1Count}): </span>{r.h1Text || <em className="text-destructive">none</em>}</div>
              <div className="md:col-span-2"><span className="text-muted-foreground">Description ({r.description.length}): </span>{r.description || <em className="text-destructive">missing</em>}</div>
              <div className="md:col-span-2"><span className="text-muted-foreground">Canonical: </span>{r.canonical || <em className="text-destructive">missing</em>}</div>
              <div><span className="text-muted-foreground">OG Title: </span>{r.ogTitle ? '✓' : <em className="text-destructive">missing</em>}</div>
              <div><span className="text-muted-foreground">OG Type: </span>{r.ogType || <em className="text-yellow-400">missing</em>}</div>
              <div><span className="text-muted-foreground">OG Description: </span>{r.ogDescription ? '✓' : <em className="text-destructive">missing</em>}</div>
              <div><span className="text-muted-foreground">OG Image: </span>{r.ogImage ? '✓' : <em className="text-destructive">missing</em>}</div>
              <div><span className="text-muted-foreground">Twitter card: </span>{r.twitterCard || <em className="text-destructive">missing</em>}</div>
            </div>

            {r.issues.length > 0 && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs font-bold mb-1">Issues:</p>
                <ul className="text-xs space-y-1">
                  {r.issues.map((i, idx) => <li key={idx}>• {i}</li>)}
                </ul>
              </div>
            )}
          </Card>
        ))}
        {loading && results.length === 0 && <div className="text-muted-foreground">Auditing routes…</div>}
      </div>
    </AdminLayout>
  );
};

export default AdminSEO;
