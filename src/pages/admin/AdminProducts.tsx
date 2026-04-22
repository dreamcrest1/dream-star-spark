import { useEffect, useState, FormEvent } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2, Search, Link2, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from './AdminLayout';
import ProductImage from '@/components/ProductImage';
import AiAssistButton from '@/components/admin/AiAssistButton';

interface ProductRow {
  id: number;
  name: string;
  description: string;
  sale_price: number | null;
  regular_price: number;
  category: string;
  image: string;
  external_url: string;
  button_text: string;
}

const empty: ProductRow = {
  id: 0, name: '', description: '', sale_price: null, regular_price: 0,
  category: '', image: '', external_url: '', button_text: 'Buy Now',
};

const AdminProducts = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Bulk-update payment URL
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkUrl, setBulkUrl] = useState('');
  const [bulkBusy, setBulkBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false });
    if (error) toast({ title: 'Failed to load', description: error.message, variant: 'destructive' });
    setItems((data as ProductRow[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = items.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const payload = {
      ...editing,
      sale_price: editing.sale_price ? Number(editing.sale_price) : null,
      regular_price: Number(editing.regular_price),
    };
    const isNew = !items.some((i) => i.id === editing.id);
    if (isNew) {
      if (!payload.id) payload.id = Date.now();
      const { error } = await supabase.from('products').insert(payload);
      if (error) return toast({ title: 'Save failed', description: error.message, variant: 'destructive' });
      toast({ title: 'Product created' });
    } else {
      const { error } = await supabase.from('products').update(payload).eq('id', editing.id);
      if (error) return toast({ title: 'Save failed', description: error.message, variant: 'destructive' });
      toast({ title: 'Product updated' });
    }
    setEditing(null);
    load();
  };

  const onDelete = async () => {
    if (deletingId === null) return;
    const { error } = await supabase.from('products').delete().eq('id', deletingId);
    if (error) toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
    else toast({ title: 'Product deleted' });
    setDeletingId(null);
    load();
  };

  const applyBulkUrl = async () => {
    const url = bulkUrl.trim();
    if (!url) {
      toast({ title: 'URL required', variant: 'destructive' });
      return;
    }
    setBulkBusy(true);
    // Update every row by setting external_url. Use a guard filter that matches all.
    const { error, count } = await supabase
      .from('products')
      .update({ external_url: url }, { count: 'exact' })
      .gte('id', 0);
    setBulkBusy(false);
    if (error) {
      toast({ title: 'Bulk update failed', description: error.message, variant: 'destructive' });
      return;
    }
    toast({
      title: 'Payment links updated',
      description: `${count ?? items.length} product${(count ?? items.length) === 1 ? '' : 's'} now point to ${url}`,
    });
    setBulkOpen(false);
    setBulkUrl('');
    load();
  };

  return (
    <AdminLayout title="Products">
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setBulkOpen(true)}>
            <Link2 className="w-4 h-4 mr-2" />
            Bulk Update Payment Link
          </Button>
          <Button onClick={() => setEditing({ ...empty })}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Sale</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>
            )}
            {!loading && filtered.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No products</TableCell></TableRow>
            )}
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="w-12 h-12 rounded overflow-hidden bg-muted">
                    <ProductImage src={p.image} name={p.name} className="w-full h-full" />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell><span className="text-xs px-2 py-1 rounded bg-muted">{p.category}</span></TableCell>
                <TableCell className="text-right">₹{Number(p.regular_price).toLocaleString()}</TableCell>
                <TableCell className="text-right">{p.sale_price ? `₹${Number(p.sale_price).toLocaleString()}` : '—'}</TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" onClick={() => setEditing(p)}><Pencil className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => setDeletingId(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Edit / Create dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{editing && items.some((i) => i.id === editing.id) ? 'Edit Product' : 'Add Product'}</DialogTitle>
          </DialogHeader>
          {editing && (
            <form onSubmit={onSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required />
                </div>
                <div>
                  <Label>Category</Label>
                  <Input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} required />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label>Description</Label>
                  <div className="flex gap-2">
                    <AiAssistButton
                      task="product_description"
                      context={{ name: editing.name, category: editing.category, current: editing.description }}
                      onResult={(r) => setEditing({ ...editing, description: r })}
                      label="AI Write"
                      disabled={!editing.name}
                    />
                    {editing.description && (
                      <AiAssistButton
                        task="rewrite_cyberpunk"
                        context={{ text: editing.description }}
                        onResult={(r) => setEditing({ ...editing, description: r })}
                        label="Cyberpunk Rewrite"
                        variant="ghost"
                      />
                    )}
                  </div>
                </div>
                <Textarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Regular Price (₹)</Label>
                  <Input type="number" min={0} value={editing.regular_price}
                    onChange={(e) => setEditing({ ...editing, regular_price: Number(e.target.value) })} required />
                </div>
                <div>
                  <Label>Sale Price (₹) — optional</Label>
                  <Input type="number" min={0} value={editing.sale_price ?? ''}
                    onChange={(e) => setEditing({ ...editing, sale_price: e.target.value === '' ? null : Number(e.target.value) })} />
                </div>
              </div>
              <div>
                <Label>Image URL</Label>
                <Input value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>External URL (Buy link)</Label>
                  <Input value={editing.external_url} onChange={(e) => setEditing({ ...editing, external_url: e.target.value })} />
                </div>
                <div>
                  <Label>Button Text</Label>
                  <Input value={editing.button_text} onChange={(e) => setEditing({ ...editing, button_text: e.target.value })} />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Bulk update payment link */}
      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="w-5 h-5" /> Bulk Update Payment Link
            </DialogTitle>
            <DialogDescription>
              This will set <strong>every product's</strong> Buy-button URL to the URL below. Use it when migrating between Cosmofeed accounts or testing a new payment provider.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label>New payment URL for all products</Label>
              <Input
                value={bulkUrl}
                onChange={(e) => setBulkUrl(e.target.value)}
                placeholder="https://test.com"
                autoFocus
              />
            </div>
            <div className="flex items-start gap-2 text-xs text-destructive-foreground bg-destructive/10 border border-destructive/30 rounded p-3">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-destructive" />
              <span>
                This will overwrite the current Buy URL on <strong>{items.length}</strong> product{items.length === 1 ? '' : 's'}. There is no undo — make sure the URL is correct.
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkOpen(false)}>Cancel</Button>
            <Button onClick={applyBulkUrl} disabled={bulkBusy || !bulkUrl.trim()}>
              {bulkBusy ? 'Updating…' : `Apply to ${items.length} product${items.length === 1 ? '' : 's'}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={deletingId !== null} onOpenChange={(o) => !o && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this product?</AlertDialogTitle>
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

export default AdminProducts;
