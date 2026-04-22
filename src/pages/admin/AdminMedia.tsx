import { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Trash2, Copy, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from './AdminLayout';

interface MediaRow {
  id: number;
  url: string;
  path: string;
  name: string;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
}

const AdminMedia = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<MediaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
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
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from('media').upload(path, file, {
        contentType: file.type, upsert: false,
      });
      if (upErr) { toast({ title: 'Upload failed', description: upErr.message, variant: 'destructive' }); continue; }
      const { data: pub } = supabase.storage.from('media').getPublicUrl(path);
      await supabase.from('media').insert({
        url: pub.publicUrl, path, name: file.name, mime_type: file.type, size_bytes: file.size,
      });
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
    toast({ title: 'Uploaded' });
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

  return (
    <AdminLayout title="Media Library">
      <Card className="p-6 mb-6">
        <input ref={fileRef} type="file" multiple accept="image/*" hidden onChange={(e) => upload(e.target.files)} />
        <Button onClick={() => fileRef.current?.click()} disabled={uploading}>
          <Upload className="w-4 h-4 mr-2" />{uploading ? 'Uploading…' : 'Upload Images'}
        </Button>
        <p className="text-xs text-muted-foreground mt-2">Files are stored in Lovable Cloud and served from a public URL. Copy the URL to use in products, blogs, or settings.</p>
      </Card>

      {loading && <div className="text-muted-foreground">Loading…</div>}
      {!loading && items.length === 0 && <div className="text-muted-foreground">No media uploaded yet.</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.map((m) => (
          <Card key={m.id} className="overflow-hidden group">
            <div className="aspect-square bg-muted">
              <img src={m.url} alt={m.name} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="p-2 text-xs">
              <p className="truncate" title={m.name}>{m.name}</p>
              <div className="flex gap-1 mt-2">
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => copy(m)}>
                  {copiedId === m.id ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
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
