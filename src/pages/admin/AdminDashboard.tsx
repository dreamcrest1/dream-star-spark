import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Package, Eye, Users, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from './AdminLayout';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    views7d: 0,
    visitors7d: 0,
    viewsToday: 0,
  });

  useEffect(() => {
    (async () => {
      const since = new Date(Date.now() - 7 * 86400_000).toISOString();
      const today = new Date(); today.setHours(0,0,0,0);
      const todayIso = today.toISOString();

      const [pc, vc, vall, vt] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', since),
        supabase.from('page_views').select('visitor_id').gte('created_at', since),
        supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', todayIso),
      ]);

      const uniqueVisitors = new Set((vall.data || []).map((r: { visitor_id: string | null }) => r.visitor_id).filter(Boolean));

      setStats({
        products: pc.count || 0,
        views7d: vc.count || 0,
        visitors7d: uniqueVisitors.size,
        viewsToday: vt.count || 0,
      });
    })();
  }, []);

  const cards = [
    { label: 'Total Products', value: stats.products, icon: Package, color: 'text-neon-pink' },
    { label: 'Views Today', value: stats.viewsToday, icon: Eye, color: 'text-neon-cyan' },
    { label: 'Views (7 days)', value: stats.views7d, icon: TrendingUp, color: 'text-neon-purple' },
    { label: 'Unique Visitors (7d)', value: stats.visitors7d, icon: Users, color: 'text-neon-orange' },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.label} className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{c.label}</span>
                <Icon className={`w-5 h-5 ${c.color}`} />
              </div>
              <div className="text-3xl font-display font-bold">{c.value.toLocaleString()}</div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6 mt-8">
        <h2 className="font-display text-xl font-bold mb-3">CMS Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <a href="/admin/products" className="p-3 rounded-lg border border-border hover:border-primary transition-colors">📦 <strong>Products</strong> – add/edit/delete & set per-product redirect URL</a>
          <a href="/admin/blogs" className="p-3 rounded-lg border border-border hover:border-primary transition-colors">📝 <strong>Blogs</strong> – full CMS with SEO fields</a>
          <a href="/admin/pages" className="p-3 rounded-lg border border-border hover:border-primary transition-colors">📄 <strong>Pages</strong> – edit Hero & About sections</a>
          <a href="/admin/settings" className="p-3 rounded-lg border border-border hover:border-primary transition-colors">⚙️ <strong>Site Settings</strong> – header, footer, contact, social, SEO defaults</a>
          <a href="/admin/theme" className="p-3 rounded-lg border border-border hover:border-primary transition-colors">🎨 <strong>Theme</strong> – colors & presets</a>
          <a href="/admin/media" className="p-3 rounded-lg border border-border hover:border-primary transition-colors">🖼️ <strong>Media Library</strong> – upload images</a>
          <a href="/admin/brand-rules" className="p-3 rounded-lg border border-border hover:border-primary transition-colors">🏷️ <strong>Brand Logo Rules</strong> – fix broken product images</a>
          <a href="/admin/seo" className="p-3 rounded-lg border border-border hover:border-primary transition-colors">🔍 <strong>SEO Audit</strong> – validate every page</a>
        </div>
      </Card>
    </AdminLayout>
  );
};

export default AdminDashboard;
