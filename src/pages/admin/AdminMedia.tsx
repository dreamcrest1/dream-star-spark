import { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Trash2, Copy, Check, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from './AdminLayout';
import { optimizeImage } from '@/lib/imageOptimize';
import { aiAssist } from '@/lib/aiAssist';

interface MediaRow {
  id: number;
  url: string;
  path: string;
  name: string;
  mime_type: string | null;
  size_bytes: number | null;
  alt_text: string | null;
  created_at: string;
}

const formatBytes = (b: number | null) => {
  if (!b) return '';
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
};

const AdminMedia = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<MediaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [altBusyId, setAltBusyId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('media').select('*').order('created_at', { ascending: false });
    setItems((data as MediaRow[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const arr = Array.from(files);
    let i = 0;
    for (const file of arr) {
      i += 1;
      try {
        setProgress(`Optimizing ${i}/${arr.length}: ${file.name}`);
        const { main, thumb } = await optimizeImage(file);

        const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const mainPath = `${stamp}-${main.name}`;
        const thumbPath = `${stamp}-thumb-${thumb.name}`;

        setProgress(`Uploading ${i}/${arr.length}: ${file.name}`);
        const [{ error: e1 }, { error: e2 }] = await Promise.all([
          supabase.storage.from('media').upload(mainPath, main, { contentType: main.type, upsert: false }),
          supabase.storage.from('media').upload(thumbPath, thumb, { contentType: thumb.type, upsert: false }),
        ]);
        if (e1) throw e1;
        if (e2) console.warn('Thumb upload failed (non-fatal):', e2);

        const { data: pub } = supabase.storage.from('media').getPublicUrl(mainPath);

        // Insert row first so the user sees it instantly
        const { data: inserted, error: insErr } = await supabase
          .from('media')
          .insert({
            url: pub.publicUrl,
            path: mainPath,
            name: file.name.replace(/\.[^.]+$/, '.webp'),
            mime_type: main.type,
            size_bytes: main.size,
          })
          .select('*')
          .single();
        if (insErr) throw insErr;

        // Best-effort AI alt-text in the background
        if (inserted) {
          aiAssist('alt_text', { imageUrl: pub.publicUrl })
            .then(async (alt: string) => {
              if (alt && typeof alt === 'string') {
                await supabase.from('media').update({ alt_text: alt }).eq('id', (inserted as any).id);
                load();
              }
            })
            .catch((err) => console.warn('Alt text generation skipped:', err.message));
        }
      } catch (err: any) {
        toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
      }
    }
    setProgress('');
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
    toast({ title: 'Upload complete', description: 'Images optimized to WebP. AI is generating alt text…' });
    load();
  };

  const del = async (item: MediaRow) => {
    if (!confirm(`Delete ${item.name}?`)) return;
    await supabase.storage.from('media').remove([item.path]);
    await supabase.from('media').delete().eq('id', item.id);
    load();
  };

  const copy = (item: MediaRow) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const regenerateAlt = async (item: MediaRow) => {
    setAltBusyId(item.id);
    try {
      const alt = await aiAssist('alt_text', { imageUrl: item.url });
      await supabase.from('media').update({ alt_text: alt }).eq('id', item.id);
      toast({ title: 'Alt text generated' });
      load();
    } catch (e: any) {
      toast({ title: 'AI failed', description: e.message, variant: 'destructive' });
    } finally {
      setAltBusyId(null);
    }
  };

  const updateAlt = async (id: number, alt: string) => {
    await supabase.from('media').update({ alt_text: alt }).eq('id', id);
    setItems((prev) => prev.map((m) => (m.id === id ? { ...m, alt_text: alt } : m)));
  };

  return (
    <AdminLayout title="Media Library">
      <Card className="p-6 mb-6">
        <input ref={fileRef} type="file" multiple accept="image/*" hidden onChange={(e) => upload(e.target.files)} />
        <div className="flex items-center gap-3 flex-wrap">
          <Button onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            {uploading ? 'Processing…' : 'Upload Images'}
          </Button>
          {progress && <span className="text-xs text-muted-foreground">{progress}</span>}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Images are auto-optimized to <strong>WebP</strong> (max 1920px, ~1.2MB) with a 320px thumbnail. AI generates alt-text in the background.
        </p>
      </Card>

      {loading && <div className="text-muted-foreground">Loading…</div>}
      {!loading && items.length === 0 && <div className="text-muted-foreground">No media uploaded yet.</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((m) => (
          <Card key={m.id} className="overflow-hidden group flex flex-col">
            <div className="aspect-video bg-muted">
              <img
                src={m.url}
                alt={m.alt_text || m.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-3 flex-1 flex flex-col gap-2 text-xs">
              <p className="truncate font-medium" title={m.name}>{m.name}</p>
              <p className="text-muted-foreground">{formatBytes(m.size_bytes)} · WebP</p>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-muted-foreground">Alt text</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => regenerateAlt(m)}
                    disabled={altBusyId === m.id}
                    title="Regenerate with AI"
                  >
                    {altBusyId === m.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  </Button>
                </div>
                <Input
                  value={m.alt_text || ''}
                  onChange={(e) => setItems((prev) => prev.map((x) => (x.id === m.id ? { ...x, alt_text: e.target.value } : x)))}
                  onBlur={(e) => updateAlt(m.id, e.target.value)}
                  placeholder="Generating…"
                  className="h-7 text-xs"
                />
              </div>

              <div className="flex gap-1 mt-auto">
                <Button size="sm" variant="ghost" className="h-7 flex-1" onClick={() => copy(m)}>
                  {copiedId === m.id ? <Check className="w-3 h-3 mr-1 text-green-400" /> : <Copy className="w-3 h-3 mr-1" />}
                  URL
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => del(m)}>
                  <Trash2 className="w-3 h-3 text-destructive" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminMedia;
