import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Check, Download, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from './AdminLayout';
import { useSiteSettings, saveSiteSetting, DEFAULT_SETTINGS } from '@/hooks/useSiteSettings';

interface ThemePreset {
  name: string;
  theme: Record<string, string>;
}

const ColorChips = ({ theme }: { theme: Record<string, string> }) => (
  <div className="flex gap-1">
    {(['neonPink', 'neonCyan', 'neonPurple', 'neonOrange', 'background'] as const).map((k) =>
      theme[k] ? (
        <div key={k} className="w-5 h-5 rounded border border-border" style={{ background: `hsl(${theme[k]})` }} />
      ) : null,
    )}
  </div>
);

const AdminThemePresets = () => {
  const { toast } = useToast();
  const { settings, loading } = useSiteSettings();
  const [presets, setPresets] = useState<ThemePreset[]>([]);
  const [activeName, setActiveName] = useState<string>('');
  const [newName, setNewName] = useState('');
  const [importJson, setImportJson] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading) return;
    const stored = settings.theme_presets as { presets?: ThemePreset[]; active?: string } | undefined;
    setPresets(stored?.presets || []);
    setActiveName(stored?.active || '');
  }, [loading, settings]);

  const persist = async (next: ThemePreset[], active: string) => {
    setSaving(true);
    try {
      await saveSiteSetting('theme_presets', { presets: next, active });
      setPresets(next);
      setActiveName(active);
    } catch (e: any) {
      toast({ title: 'Save failed', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const saveCurrentAsPreset = async () => {
    const name = newName.trim();
    if (!name) {
      toast({ title: 'Name required', description: 'Give the preset a short name.', variant: 'destructive' });
      return;
    }
    if (presets.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      toast({ title: 'Duplicate name', variant: 'destructive' });
      return;
    }
    const currentTheme = { ...DEFAULT_SETTINGS.theme, ...(settings.theme || {}) };
    const next = [...presets, { name, theme: currentTheme }];
    await persist(next, activeName);
    setNewName('');
    toast({ title: 'Preset saved', description: `"${name}" added.` });
  };

  const activate = async (preset: ThemePreset) => {
    try {
      await saveSiteSetting('theme', preset.theme);
      await persist(presets, preset.name);
      toast({ title: 'Preset activated', description: `"${preset.name}" is now live.` });
    } catch (e: any) {
      toast({ title: 'Activate failed', description: e.message, variant: 'destructive' });
    }
  };

  const remove = async (preset: ThemePreset) => {
    if (!confirm(`Delete preset "${preset.name}"?`)) return;
    const next = presets.filter((p) => p.name !== preset.name);
    await persist(next, activeName === preset.name ? '' : activeName);
    toast({ title: 'Preset deleted' });
  };

  const exportAll = () => {
    const blob = new Blob([JSON.stringify({ presets, active: activeName }, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dreamstar-theme-presets-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const doImport = async () => {
    try {
      const parsed = JSON.parse(importJson);
      const incoming: ThemePreset[] = parsed?.presets || [];
      if (!Array.isArray(incoming)) throw new Error('Invalid file: expected { presets: [...] }');
      // Merge by name (overwrite)
      const map = new Map(presets.map((p) => [p.name, p]));
      for (const p of incoming) {
        if (p?.name && p?.theme) map.set(p.name, p);
      }
      await persist(Array.from(map.values()), activeName);
      setImportJson('');
      toast({ title: 'Imported', description: `${incoming.length} preset(s) merged.` });
    } catch (e: any) {
      toast({ title: 'Import failed', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <AdminLayout title="Theme Presets">
      <p className="text-sm text-muted-foreground mb-6">
        Save the current theme as a named preset, then switch instantly. Use the <strong>Theme</strong> page to edit colors first, then come here to save it.
      </p>

      <Card className="p-6 mb-6">
        <h3 className="font-display font-bold mb-3">Save current theme as preset</h3>
        <div className="flex gap-2">
          <Input
            placeholder='e.g. "Neon Pink Mode"'
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Button onClick={saveCurrentAsPreset} disabled={saving}>
            <Plus className="w-4 h-4 mr-2" /> Save Preset
          </Button>
        </div>
        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
          <span>Current colors:</span>
          <ColorChips theme={{ ...DEFAULT_SETTINGS.theme, ...(settings.theme || {}) }} />
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold">Saved Presets</h3>
          <Button size="sm" variant="outline" onClick={exportAll} disabled={presets.length === 0}>
            <Download className="w-4 h-4 mr-2" /> Export JSON
          </Button>
        </div>

        {presets.length === 0 && (
          <div className="text-sm text-muted-foreground py-6 text-center">
            No presets yet. Save your current theme above to get started.
          </div>
        )}

        <div className="space-y-2">
          {presets.map((p) => {
            const isActive = p.name === activeName;
            return (
              <div
                key={p.name}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  isActive ? 'border-primary bg-primary/5' : 'border-border bg-card'
                }`}
              >
                <ColorChips theme={p.theme} />
                <div className="flex-1">
                  <div className="font-medium flex items-center gap-2">
                    {p.name}
                    {isActive && (
                      <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary flex items-center gap-1">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>
                </div>
                <Button size="sm" variant={isActive ? 'secondary' : 'default'} onClick={() => activate(p)} disabled={isActive}>
                  {isActive ? 'Active' : 'Activate'}
                </Button>
                <Button size="icon" variant="ghost" onClick={() => remove(p)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-display font-bold mb-3 flex items-center gap-2">
          <Upload className="w-4 h-4" /> Import presets (paste JSON)
        </h3>
        <Textarea
          placeholder='{ "presets": [{ "name": "...", "theme": { ... } }] }'
          value={importJson}
          onChange={(e) => setImportJson(e.target.value)}
          rows={5}
          className="font-mono text-xs"
        />
        <div className="mt-2">
          <Button onClick={doImport} disabled={!importJson.trim()}>Import</Button>
        </div>
      </Card>
    </AdminLayout>
  );
};

export default AdminThemePresets;
