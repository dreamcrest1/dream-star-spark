import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { GripVertical, RotateCcw, Eye } from 'lucide-react';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from './AdminLayout';
import LivePreview from '@/components/admin/LivePreview';
import {
  DEFAULT_LAYOUT, SECTION_META, type SectionConfig, type SectionId,
} from '@/lib/homeLayout';
import { useSiteSettings, saveSiteSetting } from '@/hooks/useSiteSettings';

const SortableRow = ({
  section,
  onToggle,
}: {
  section: SectionConfig;
  onToggle: (id: SectionId, enabled: boolean) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const meta = SECTION_META[section.id];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-5 h-5" />
      </button>
      <div className="flex-1">
        <div className="font-medium">{meta.label}</div>
        <div className="text-xs text-muted-foreground">{meta.description}</div>
      </div>
      <Switch checked={section.enabled} onCheckedChange={(v) => onToggle(section.id, v)} />
    </div>
  );
};

const AdminPageBuilder = () => {
  const { toast } = useToast();
  const { settings, loading } = useSiteSettings();
  const [layout, setLayout] = useState<SectionConfig[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  useEffect(() => {
    if (!loading && layout === null) {
      const stored = (settings.home_layout as any)?.sections as SectionConfig[] | undefined;
      const valid = Array.isArray(stored) && stored.length > 0
        ? stored.filter((s) => SECTION_META[s.id])
        : DEFAULT_LAYOUT;
      // ensure every default section appears
      const seen = new Set(valid.map((s) => s.id));
      const merged = [...valid];
      for (const def of DEFAULT_LAYOUT) if (!seen.has(def.id)) merged.push(def);
      setLayout(merged);
    }
  }, [loading, settings, layout]);

  if (!layout) return <AdminLayout title="Page Builder"><div>Loading…</div></AdminLayout>;

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = layout.findIndex((s) => s.id === active.id);
    const newIndex = layout.findIndex((s) => s.id === over.id);
    setLayout(arrayMove(layout, oldIndex, newIndex));
  };

  const onToggle = (id: SectionId, enabled: boolean) => {
    setLayout(layout.map((s) => (s.id === id ? { ...s, enabled } : s)));
  };

  const reset = () => setLayout(DEFAULT_LAYOUT);

  const save = async () => {
    setSaving(true);
    try {
      await saveSiteSetting('home_layout', { sections: layout });
      toast({ title: 'Homepage layout saved', description: 'Refreshing live preview…' });
      setRefreshKey((n) => n + 1);
    } catch (e: any) {
      toast({ title: 'Save failed', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Visual Page Builder">
      <p className="text-sm text-muted-foreground mb-6">
        Drag to reorder. Toggle to show or hide. Changes apply to your homepage at <code>/</code>.
      </p>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold flex items-center gap-2">
              <Eye className="w-4 h-4" /> Sections
            </h3>
            <Button size="sm" variant="ghost" onClick={reset}>
              <RotateCcw className="w-4 h-4 mr-1" /> Reset
            </Button>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={layout.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {layout.map((s) => (
                  <SortableRow key={s.id} section={s} onToggle={onToggle} />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <div className="flex gap-2 mt-6">
            <Button onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save Layout'}
            </Button>
            <Button variant="outline" onClick={() => setRefreshKey((n) => n + 1)}>
              Refresh Preview
            </Button>
          </div>
        </Card>

        <div className="h-[800px]">
          <LivePreview path="/" refreshKey={refreshKey} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPageBuilder;
