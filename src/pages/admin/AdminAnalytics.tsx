import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import AdminLayout from './AdminLayout';

interface PageView {
  path: string;
  visitor_id: string | null;
  referrer: string | null;
  created_at: string;
}

const RANGES = [
  { label: '24h', days: 1 },
  { label: '7 days', days: 7 },
  { label: '30 days', days: 30 },
];

const AdminAnalytics = () => {
  const [days, setDays] = useState(7);
  const [rows, setRows] = useState<PageView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const since = new Date(Date.now() - days * 86400_000).toISOString();
    supabase
      .from('page_views')
      .select('path, visitor_id, referrer, created_at')
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(5000)
      .then(({ data }) => {
        setRows((data as PageView[]) || []);
        setLoading(false);
      });
  }, [days]);

  // Aggregate by day
  const byDay = (() => {
    const map = new Map<string, { date: string; views: number; visitors: Set<string> }>();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400_000);
      const key = d.toISOString().slice(0, 10);
      map.set(key, { date: key.slice(5), views: 0, visitors: new Set() });
    }
    rows.forEach((r) => {
      const key = r.created_at.slice(0, 10);
      const entry = map.get(key);
      if (entry) {
        entry.views++;
        if (r.visitor_id) entry.visitors.add(r.visitor_id);
      }
    });
    return Array.from(map.values()).map((v) => ({ date: v.date, views: v.views, visitors: v.visitors.size }));
  })();

  // Top pages
  const topPages = (() => {
    const map = new Map<string, number>();
    rows.forEach((r) => map.set(r.path, (map.get(r.path) || 0) + 1));
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  })();

  // Top referrers
  const topReferrers = (() => {
    const map = new Map<string, number>();
    rows.forEach((r) => {
      let ref = r.referrer || 'Direct';
      try { if (r.referrer) ref = new URL(r.referrer).hostname; } catch { /* keep as is */ }
      map.set(ref, (map.get(ref) || 0) + 1);
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  })();

  const totalViews = rows.length;
  const uniqueVisitors = new Set(rows.map((r) => r.visitor_id).filter(Boolean)).size;

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

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-1">Total Page Views</div>
          <div className="text-3xl font-display font-bold">{totalViews.toLocaleString()}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-1">Unique Visitors</div>
          <div className="text-3xl font-display font-bold">{uniqueVisitors.toLocaleString()}</div>
        </Card>
      </div>

      <Card className="p-6 mb-6">
        <h2 className="font-display text-lg font-bold mb-4">Traffic Over Time</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={byDay}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} name="Views" />
              <Line type="monotone" dataKey="visitors" stroke="hsl(var(--accent))" strokeWidth={2} name="Visitors" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

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
