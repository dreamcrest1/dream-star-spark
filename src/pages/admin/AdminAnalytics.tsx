import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';
import AdminLayout from './AdminLayout';
import { MousePointerClick, Eye, Users, TrendingUp } from 'lucide-react';

interface PageView {
  path: string;
  visitor_id: string | null;
  referrer: string | null;
  created_at: string;
  device: string | null;
}

interface ProductClick {
  product_id: number | null;
  product_name: string | null;
  visitor_id: string | null;
  source_path: string | null;
  device: string | null;
  created_at: string;
}

const RANGES = [
  { label: '24h', days: 1 },
  { label: '7 days', days: 7 },
  { label: '30 days', days: 30 },
];

const DEVICE_COLORS: Record<string, string> = {
  desktop: 'hsl(var(--neon-cyan))',
  mobile: 'hsl(var(--neon-pink))',
  tablet: 'hsl(var(--neon-purple))',
  unknown: 'hsl(var(--muted-foreground))',
};

const AdminAnalytics = () => {
  const [days, setDays] = useState(7);
  const [views, setViews] = useState<PageView[]>([]);
  const [clicks, setClicks] = useState<ProductClick[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const since = new Date(Date.now() - days * 86400_000).toISOString();
    Promise.all([
      supabase
        .from('page_views')
        .select('path, visitor_id, referrer, created_at, device')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(5000),
      supabase
        .from('product_clicks')
        .select('product_id, product_name, visitor_id, source_path, device, created_at')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(5000),
    ]).then(([v, c]) => {
      setViews((v.data as PageView[]) || []);
      setClicks((c.data as ProductClick[]) || []);
      setLoading(false);
    });
  }, [days]);

  // Daily traffic + clicks
  const byDay = (() => {
    const map = new Map<string, { date: string; views: number; clicks: number; visitors: Set<string> }>();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400_000);
      const key = d.toISOString().slice(0, 10);
      map.set(key, { date: key.slice(5), views: 0, clicks: 0, visitors: new Set() });
    }
    views.forEach((r) => {
      const e = map.get(r.created_at.slice(0, 10));
      if (e) { e.views++; if (r.visitor_id) e.visitors.add(r.visitor_id); }
    });
    clicks.forEach((r) => {
      const e = map.get(r.created_at.slice(0, 10));
      if (e) e.clicks++;
    });
    return Array.from(map.values()).map((v) => ({
      date: v.date, views: v.views, clicks: v.clicks, visitors: v.visitors.size,
    }));
  })();

  // Device breakdown (combined views + clicks)
  const deviceData = (() => {
    const map = new Map<string, number>();
    views.forEach((r) => {
      const d = r.device || 'unknown';
      map.set(d, (map.get(d) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  })();

  // Top pages
  const topPages = (() => {
    const map = new Map<string, number>();
    views.forEach((r) => map.set(r.path, (map.get(r.path) || 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);
  })();

  // Top referrers
  const topReferrers = (() => {
    const map = new Map<string, number>();
    views.forEach((r) => {
      let ref = r.referrer || 'Direct';
      try { if (r.referrer) ref = new URL(r.referrer).hostname; } catch { /* keep */ }
      map.set(ref, (map.get(ref) || 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);
  })();

  // Top clicked products
  const topProducts = (() => {
    const map = new Map<string, number>();
    clicks.forEach((r) => {
      const k = r.product_name || `Product #${r.product_id}`;
      map.set(k, (map.get(k) || 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);
  })();

  const totalViews = views.length;
  const totalClicks = clicks.length;
  const uniqueVisitors = new Set(views.map((r) => r.visitor_id).filter(Boolean)).size;
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : '0.00';

  return (
    <AdminLayout title="Analytics">
      <div className="flex gap-2 mb-6">
        {RANGES.map((r) => (
          <button
            key={r.days}
            onClick={() => setDays(r.days)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              days === r.days ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Page Views</div>
            <Eye className="w-4 h-4 text-neon-cyan" />
          </div>
          <div className="text-2xl font-display font-bold">{totalViews.toLocaleString()}</div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Unique Visitors</div>
            <Users className="w-4 h-4 text-neon-purple" />
          </div>
          <div className="text-2xl font-display font-bold">{uniqueVisitors.toLocaleString()}</div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Buy Clicks</div>
            <MousePointerClick className="w-4 h-4 text-neon-pink" />
          </div>
          <div className="text-2xl font-display font-bold">{totalClicks.toLocaleString()}</div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Click-through Rate</div>
            <TrendingUp className="w-4 h-4 text-neon-orange" />
          </div>
          <div className="text-2xl font-display font-bold">{ctr}%</div>
        </Card>
      </div>

      {/* Funnel */}
      <Card className="p-6 mb-6">
        <h2 className="font-display text-lg font-bold mb-4">Conversion Funnel</h2>
        <div className="space-y-3">
          {[
            { label: 'Page Views', value: totalViews, color: 'from-neon-cyan to-neon-purple' },
            { label: 'Unique Visitors', value: uniqueVisitors, color: 'from-neon-purple to-neon-pink' },
            { label: 'Buy Clicks → Cosmofeed', value: totalClicks, color: 'from-neon-pink to-neon-orange' },
          ].map((step) => {
            const pct = totalViews > 0 ? (step.value / totalViews) * 100 : 0;
            return (
              <div key={step.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground">{step.label}</span>
                  <span className="text-muted-foreground">{step.value.toLocaleString()} ({pct.toFixed(1)}%)</span>
                </div>
                <div className="h-3 bg-muted/40 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${step.color} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.max(pct, 2)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Traffic chart */}
      <Card className="p-6 mb-6">
        <h2 className="font-display text-lg font-bold mb-4">Traffic & Conversions Over Time</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={byDay}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Legend />
              <Line type="monotone" dataKey="views" stroke="hsl(var(--neon-cyan))" strokeWidth={2} name="Views" />
              <Line type="monotone" dataKey="visitors" stroke="hsl(var(--neon-purple))" strokeWidth={2} name="Visitors" />
              <Line type="monotone" dataKey="clicks" stroke="hsl(var(--neon-pink))" strokeWidth={2} name="Buy Clicks" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        {/* Device pie */}
        <Card className="p-6">
          <h2 className="font-display text-lg font-bold mb-4">Device Breakdown</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deviceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {deviceData.map((d) => (
                    <Cell key={d.name} fill={DEVICE_COLORS[d.name] || DEVICE_COLORS.unknown} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top products bar */}
        <Card className="p-6">
          <h2 className="font-display text-lg font-bold mb-4">Top Clicked Products</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts.slice(0, 6).map(([name, value]) => ({
                name: name.length > 20 ? name.slice(0, 20) + '…' : name,
                value,
              }))} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={120} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Bar dataKey="value" fill="hsl(var(--neon-pink))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-display text-lg font-bold mb-4">Top Pages</h2>
          <Table>
            <TableHeader>
              <TableRow><TableHead>Path</TableHead><TableHead className="text-right">Views</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {topPages.length === 0 && <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground py-4">{loading ? 'Loading…' : 'No data yet'}</TableCell></TableRow>}
              {topPages.map(([p, n]) => (
                <TableRow key={p}><TableCell className="font-mono text-sm">{p}</TableCell><TableCell className="text-right">{n}</TableCell></TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-lg font-bold mb-4">Top Referrers</h2>
          <Table>
            <TableHeader>
              <TableRow><TableHead>Source</TableHead><TableHead className="text-right">Views</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {topReferrers.length === 0 && <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground py-4">{loading ? 'Loading…' : 'No data yet'}</TableCell></TableRow>}
              {topReferrers.map(([r, n]) => (
                <TableRow key={r}><TableCell className="text-sm">{r}</TableCell><TableCell className="text-right">{n}</TableCell></TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
