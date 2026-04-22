import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useSiteSettings, saveSiteSetting } from '@/hooks/useSiteSettings';
import AdminLayout from './AdminLayout';

const ColorRow = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => {
  // value is "H S% L%" (HSL). We display a swatch using inline style.
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded border border-border" style={{ background: `hsl(${value})` }} />
      <div className="flex-1">
        <Label>{label}</Label>
        <Input value={value} onChange={(e) => onChange(e.target.value)} className="font-mono text-xs" placeholder="320 100% 60%" />
      </div>
    </div>
  );
};

const presets = [
  { name: 'Synthwave (default)', neonPink: '320 100% 60%', neonCyan: '180 100% 50%', neonPurple: '280 100% 65%', neonOrange: '25 100% 55%', background: '270 50% 6%' },
  { name: 'Cyberpunk Yellow', neonPink: '50 100% 60%', neonCyan: '180 100% 50%', neonPurple: '280 100% 65%', neonOrange: '25 100% 55%', background: '240 30% 8%' },
  { name: 'Neon Red', neonPink: '0 100% 60%', neonCyan: '200 100% 60%', neonPurple: '320 100% 65%', neonOrange: '25 100% 55%', background: '0 30% 8%' },
  { name: 'Matrix Green', neonPink: '140 100% 50%', neonCyan: '180 100% 50%', neonPurple: '100 100% 60%', neonOrange: '60 100% 55%', background: '140 30% 6%' },
];

const AdminTheme = () => {
  const { toast } = useToast();
  const { settings, loading } = useSiteSettings();
  const [theme, setTheme] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && theme === null) setTheme(structuredClone(settings.theme));
  }, [loading, settings, theme]);

  const save = async () => {
    setSaving(true);
    try {
      await saveSiteSetting('theme', theme);
      toast({ title: 'Theme saved', description: 'Reload pages to see changes.' });
    } catch (e: any) {
      toast({ title: 'Save failed', description: e.message, variant: 'destructive' });
    } finally { setSaving(false); }
  };

  if (loading || !theme) return <AdminLayout title="Theme"><div>Loading…</div></AdminLayout>;

  return (
    <AdminLayout title="Theme Editor">
      <Card className="p-6 mb-6">
        <h3 className="font-display font-bold mb-4">Quick Presets</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={() => setTheme({ ...theme, ...p })}
              className="p-3 rounded-lg border border-border hover:border-primary transition-colors text-left"
            >
              <div className="flex gap-1 mb-2">
                <div className="w-6 h-6 rounded" style={{ background: `hsl(${p.neonPink})` }} />
                <div className="w-6 h-6 rounded" style={{ background: `hsl(${p.neonCyan})` }} />
                <div className="w-6 h-6 rounded" style={{ background: `hsl(${p.neonPurple})` }} />
              </div>
              <p className="text-xs">{p.name}</p>
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-6 space-y-4 mb-6">
        <h3 className="font-display font-bold">Colors (HSL format: "Hue Saturation% Lightness%")</h3>
        <ColorRow label="Neon Pink (primary accent)" value={theme.neonPink} onChange={(v) => setTheme({ ...theme, neonPink: v })} />
        <ColorRow label="Neon Cyan (secondary accent)" value={theme.neonCyan} onChange={(v) => setTheme({ ...theme, neonCyan: v })} />
        <ColorRow label="Neon Purple" value={theme.neonPurple} onChange={(v) => setTheme({ ...theme, neonPurple: v })} />
        <ColorRow label="Neon Orange" value={theme.neonOrange} onChange={(v) => setTheme({ ...theme, neonOrange: v })} />
        <ColorRow label="Background" value={theme.background} onChange={(v) => setTheme({ ...theme, background: v })} />
      </Card>

      <Button onClick={save} disabled={saving}>Save Theme</Button>
    </AdminLayout>
  );
};

export default AdminTheme;
