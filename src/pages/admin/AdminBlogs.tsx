import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from './AdminLayout';
import type { BlogRow } from '@/hooks/useBlogs';

const AdminBlogs = () => {
  const { toast } = useToast();
  const [blogs, setBlogs] = useState<BlogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('blogs').select('*').order('published_at', { ascending: false });
    setBlogs((data as BlogRow[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onDelete = async () => {
    if (deletingId === null) return;
    const { error } = await supabase.from('blogs').delete().eq('id', deletingId);
    if (error) toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
    else toast({ title: 'Blog deleted' });
    setDeletingId(null);
    load();
  };

  const filtered = blogs.filter((b) =>
    !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Blogs">
      <div className="flex items-center justify-between mb-4 gap-4">
        <Input placeholder="Search blogs..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
        <Link to="/admin/blogs/new">
          <Button><Plus className="w-4 h-4 mr-2" />New Blog</Button>
        </Link>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>}
            {!loading && filtered.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No blogs</TableCell></TableRow>}
            {filtered.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-medium max-w-md truncate">{b.title}</TableCell>
                <TableCell className="text-muted-foreground text-xs font-mono">{b.slug}</TableCell>
                <TableCell><span className="text-xs px-2 py-1 rounded bg-muted">{b.category}</span></TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-1 rounded ${b.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {b.published ? 'Published' : 'Draft'}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{new Date(b.published_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Link to={`/admin/blogs/${b.id}`}><Button size="icon" variant="ghost"><Pencil className="w-4 h-4" /></Button></Link>
                  <Button size="icon" variant="ghost" onClick={() => setDeletingId(b.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <AlertDialog open={deletingId !== null} onOpenChange={(o) => !o && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this blog?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminBlogs;
