import { useEffect, useState, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from './AdminLayout';

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const AdminBlogEditor = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = !id;
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState<any>({
    title: '', slug: '', excerpt: '', content: '', image: '', category: 'General',
    author: 'Dreamstar Team', read_time: '3 min', seo_title: '', seo_description: '',
    published: true, published_at: new Date().toISOString().slice(0, 10),
  });
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const { data } = await supabase.from('blogs').select('*').eq('id', Number(id)).maybeSingle();
      if (data) {
        setForm({
          ...data,
          seo_title: data.seo_title || '',
          seo_description: data.seo_description || '',
          published_at: data.published_at?.slice(0, 10) || new Date().toISOString().slice(0, 10),
        });
      }
      setLoading(false);
    })();
  }, [id, isNew]);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      slug: form.slug || slugify(form.title),
      published_at: new Date(form.published_at).toISOString(),
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
    };
    if (isNew) {
      const { id: _ignore, ...insertPayload } = payload;
      const { error } = await supabase.from('blogs').insert(insertPayload);
      if (error) return toast({ title: 'Save failed', description: error.message, variant: 'destructive' });
      toast({ title: 'Blog created' });
    } else {
      const { error } = await supabase.from('blogs').update(payload).eq('id', Number(id));
      if (error) return toast({ title: 'Save failed', description: error.message, variant: 'destructive' });
      toast({ title: 'Blog saved' });
    }
    navigate('/admin/blogs');
  };

  if (loading) return <AdminLayout title="Edit Blog"><div>Loading…</div></AdminLayout>;

  return (
    <AdminLayout title={isNew ? 'New Blog' : 'Edit Blog'}>
      <Button variant="ghost" onClick={() => navigate('/admin/blogs')} className="mb-4"><ArrowLeft className="w-4 h-4 mr-2" />Back</Button>
      <form onSubmit={save} className="space-y-6">
        <Card className="p-6 space-y-4">
          <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || slugify(e.target.value) })} required /></div>
          <div><Label>Slug (URL)</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} required /></div>
          <div><Label>Excerpt</Label><Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} /></div>
          <div><Label>Cover Image URL</Label><Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></div>
          <div className="grid grid-cols-3 gap-4">
            <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
            <div><Label>Author</Label><Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></div>
            <div><Label>Read Time</Label><Input value={form.read_time} onChange={(e) => setForm({ ...form, read_time: e.target.value })} /></div>
          </div>
          <div><Label>Content (Markdown — use **bold** and - lists)</Label><Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={16} className="font-mono text-sm" /></div>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="font-display font-bold">SEO Overrides</h3>
          <div><Label>SEO Title (optional, falls back to blog title)</Label><Input value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })} /></div>
          <div><Label>SEO Description (optional, falls back to excerpt)</Label><Textarea value={form.seo_description} onChange={(e) => setForm({ ...form, seo_description: e.target.value })} rows={2} /></div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Publish Date</Label><Input type="date" value={form.published_at} onChange={(e) => setForm({ ...form, published_at: e.target.value })} /></div>
            <div className="flex items-end gap-2">
              <Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
              <Label>{form.published ? 'Published' : 'Draft'}</Label>
            </div>
          </div>
        </Card>

        <div className="flex gap-2">
          <Button type="submit">Save Blog</Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/blogs')}>Cancel</Button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminBlogEditor;
