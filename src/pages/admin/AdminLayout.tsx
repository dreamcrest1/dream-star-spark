import { ReactNode, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, BarChart3, LogOut, Home } from 'lucide-react';
import { isAdmin, logoutAdmin } from '@/lib/adminAuth';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

const AdminLayout = ({ children, title }: { children: ReactNode; title: string }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin()) navigate('/admin', { replace: true });
  }, [navigate]);

  const onLogout = () => {
    logoutAdmin();
    navigate('/admin', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex">
      <SEO title={`${title} – Admin`} description="Dreamstar Solution admin panel" noindex />
      <aside className="w-64 border-r border-border bg-card/50 flex flex-col">
        <div className="p-6 border-b border-border">
          <Link to="/admin/dashboard" className="font-display text-xl font-bold">
            <span className="text-neon-pink">DREAM</span>
            <span className="text-neon-cyan">STAR</span>
            <div className="text-xs font-normal text-muted-foreground mt-1">Admin Panel</div>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map((l) => {
            const active = location.pathname === l.to;
            const Icon = l.icon;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary/20 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border space-y-2">
          <Link to="/" className="block">
            <Button variant="outline" size="sm" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              View Site
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="w-full" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">
          <h1 className="font-display text-3xl font-bold mb-8">{title}</h1>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
