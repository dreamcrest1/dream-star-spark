import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2, Save, X, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { invalidateBrandRulesCache } from '@/hooks/useBrandRules';
import AdminLayout from './AdminLayout';

interface RuleRow {
  id: number;
  pattern: string;
  domain: string;
  priority: number;
  notes: string | null;
}

const empty: RuleRow = { id: 0, pattern: '', domain: '', priority: 100, notes: '' };

const AdminBrandRules = () => {
  const { toast } = useToast();
  const [rules, setRules] = useState<RuleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<RuleRow | null>(null);
  const [testInput, setTestInput] = useState('');

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('brand_rules').select('*').order('priority').order('id');
    setRules((data as RuleRow[]) || []);
    setLoading(false);
    invalidateBrandRulesCache();
  };

  useEffect(() => { load(); }, []);

  const filtered = rules.filter((r) =>
    !search || r.pattern.toLowerCase().includes(search.toLowerCase()) || r.domain.toLowerCase().includes(search.toLowerCase())
  );

  const save = async () => {
    if (!editing) return;
    try { new RegExp(editing.pattern, 'i'); } catch { return toast({ title: 'Invalid regex', variant: 'destructive' }); }
    const isNew = !rules.some((r) => r.id === editing.id);
    if (isNew) {
      const { id: _, ...rest } = editing;
      const { error } = await supabase.from('brand_rules').insert(rest);
      if (error) return toast({ title: 'Save failed', description: error.message, variant: 'destructive' });
    } else {
      const { error } = await supabase.from('brand_rules').update(editing).eq('id', editing.id);
      if (error) return toast({ title: 'Save failed', description: error.message, variant: 'destructive' });
    }
    toast({ title: 'Rule saved' });
    setEditing(null);
    load();
  };

  const del = async (id: number) => {
    if (!confirm('Delete this rule?')) return;
    await supabase.from('brand_rules').delete().eq('id', id);
    load();
  };

  // Live tester
  const matchedRule = (() => {
    if (!testInput) return null;
    for (const r of [...rules].sort((a, b) => a.priority - b.priority)) {
      try { if (new RegExp(r.pattern, 'i').test(testInput)) return r; } catch { /* ignore */ }
    }
    return null;
  })();

  return (
    <AdminLayout title="Brand Logo Rules">
      <Card className="p-4 mb-6 bg-muted/30">
        <p className="text-sm text-muted-foreground mb-2">
          When a product image is missing or fails to load, we match the product name against these rules in priority order
          (lower number wins) and use the matched brand's official logo from Google's favicon service.
        </p>
      </Card>

      <Card className="p-4 mb-6">
        <Label>Test a product name</Label>
        <Input
          value={testInput}
          onChange={(e) => setTestInput(e.target.value)}
          placeholder="e.g. SonyLiv Premium 1 Year"
          className="mt-2"
        />
        {testInput && (
          <div className="mt-3 flex items-center gap-3 text-sm">
            {matchedRule ? (
              <>
                <img src={`https://www.google.com/s2/favicons?domain=${matchedRule.domain}&sz=64`} alt="" className="w-8 h-8" />
                <span>Matched: <code className="bg-muted px-1 rounded">{matchedRule.pattern}</code> → <strong>{matchedRule.domain}</strong></span>
              </>
            ) : (
              <span className="text-yellow-400">No rule matched — would use placeholder.</span>
            )}
          </div>
        )}
      </Card>

      <div className="flex items-center justify-between mb-4 gap-4">
        <Input placeholder="Search rules..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
        <Button onClick={() => setEditing({ ...empty })}><Plus className="w-4 h-4 mr-2" />Add Rule</Button>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Logo</TableHead>
              <TableHead>Pattern (regex)</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead className="w-20 text-right">Priority</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>}
            {!loading && filtered.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No rules</TableCell></TableRow>}
            {filtered.map((r) => (
              <TableRow key={r.id}>
                <TableCell><img src={`https://www.google.com/s2/favicons?domain=${r.domain}&sz=64`} alt="" className="w-8 h-8" /></TableCell>
                <TableCell className="font-mono text-xs">{r.pattern}</TableCell>
                <TableCell>{r.domain}</TableCell>
                <TableCell className="text-right">{r.priority}</TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" onClick={() => setEditing(r)}><Pencil className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => del(r.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing && rules.some((r) => r.id === editing.id) ? 'Edit Rule' : 'Add Rule'}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <Label>Pattern (case-insensitive regex)</Label>
                <Input value={editing.pattern} onChange={(e) => setEditing({ ...editing, pattern: e.target.value })} className="font-mono" />
                <p className="text-xs text-muted-foreground mt-1">e.g. <code>netflix</code> or <code>sony\s*liv|sonyliv</code></p>
              </div>
              <div>
                <Label>Domain</Label>
                <Input value={editing.domain} onChange={(e) => setEditing({ ...editing, domain: e.target.value })} placeholder="netflix.com" />
              </div>
              <div>
                <Label>Priority (lower = matched first)</Label>
                <Input type="number" value={editing.priority} onChange={(e) => setEditing({ ...editing, priority: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Notes (optional)</Label>
                <Textarea value={editing.notes || ''} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} rows={2} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}><X className="w-4 h-4 mr-2" />Cancel</Button>
            <Button onClick={save}><Save className="w-4 h-4 mr-2" />Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminBrandRules;
