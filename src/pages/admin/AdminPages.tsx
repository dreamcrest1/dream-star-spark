import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useSiteSettings, saveSiteSetting } from '@/hooks/useSiteSettings';
import { Plus, Trash2 } from 'lucide-react';
import AdminLayout from './AdminLayout';

const AdminPages = () => {
  const { toast } = useToast();
  const { settings, loading } = useSiteSettings();
  const [hero, setHero] = useState<any>(null);
  const [about, setAbout] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  if (!loading && hero === null) {
    setHero(structuredClone(settings.hero));
    setAbout(structuredClone(settings.about));
  }

  const save = async (key: string, value: any) => {
    try {
      setSaving(true);
      await saveSiteSetting(key, value);
      toast({ title: 'Saved' });
    } catch (e: any) {
      toast({ title: 'Save failed', description: e.message, variant: 'destructive' });
    } finally { setSaving(false); }
  };

  if (loading || !hero) return <AdminLayout title="Pages"><div>Loading…</div></AdminLayout>;

  return (
    <AdminLayout title="Pages">
      <Tabs defaultValue="hero">
        <TabsList className="mb-6">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="about">About Section</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card className="p-6 space-y-4">
            <div><Label>Top Badge</Label><Input value={hero.badge} onChange={(e) => setHero({ ...hero, badge: e.target.value })} /></div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label>Heading line 1</Label><Input value={hero.heading1} onChange={(e) => setHero({ ...hero, heading1: e.target.value })} /></div>
              <div><Label>Pink word</Label><Input value={hero.heading2Pink} onChange={(e) => setHero({ ...hero, heading2Pink: e.target.value })} /></div>
              <div><Label>Middle text</Label><Input value={hero.heading2Mid} onChange={(e) => setHero({ ...hero, heading2Mid: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Cyan word</Label><Input value={hero.heading2Cyan} onChange={(e) => setHero({ ...hero, heading2Cyan: e.target.value })} /></div>
              <div><Label>Heading line 3</Label><Input value={hero.heading3} onChange={(e) => setHero({ ...hero, heading3: e.target.value })} /></div>
            </div>
            <div><Label>Subheading</Label><Textarea value={hero.subheading} onChange={(e) => setHero({ ...hero, subheading: e.target.value })} /></div>
            <div><Label>Highlight (e.g. Up to 80% off)</Label><Input value={hero.highlight} onChange={(e) => setHero({ ...hero, highlight: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Primary CTA text</Label><Input value={hero.ctaPrimary} onChange={(e) => setHero({ ...hero, ctaPrimary: e.target.value })} /></div>
              <div><Label>Primary CTA link</Label><Input value={hero.ctaPrimaryHref} onChange={(e) => setHero({ ...hero, ctaPrimaryHref: e.target.value })} /></div>
              <div><Label>Secondary CTA text</Label><Input value={hero.ctaSecondary} onChange={(e) => setHero({ ...hero, ctaSecondary: e.target.value })} /></div>
              <div><Label>Secondary CTA link</Label><Input value={hero.ctaSecondaryHref} onChange={(e) => setHero({ ...hero, ctaSecondaryHref: e.target.value })} /></div>
            </div>
            <Button onClick={() => save('hero', hero)} disabled={saving}>Save Hero</Button>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <Card className="p-6 space-y-4">
            <div><Label>Eyebrow text</Label><Input value={about.eyebrow} onChange={(e) => setAbout({ ...about, eyebrow: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Title (pink part)</Label><Input value={about.titlePink} onChange={(e) => setAbout({ ...about, titlePink: e.target.value })} /></div>
              <div><Label>Title (rest)</Label><Input value={about.titleRest} onChange={(e) => setAbout({ ...about, titleRest: e.target.value })} /></div>
            </div>
            <div><Label>Body text</Label><Textarea rows={5} value={about.body} onChange={(e) => setAbout({ ...about, body: e.target.value })} /></div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Feature checklist</Label>
                <Button size="sm" variant="outline" onClick={() => setAbout({ ...about, features: [...(about.features || []), ''] })}>
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
              {(about.features || []).map((f: string, i: number) => (
                <div key={i} className="flex gap-2 mb-2">
                  <Input value={f} onChange={(e) => {
                    const next = [...about.features]; next[i] = e.target.value; setAbout({ ...about, features: next });
                  }} />
                  <Button size="icon" variant="ghost" onClick={() => setAbout({ ...about, features: about.features.filter((_: any, j: number) => j !== i) })}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
            <Button onClick={() => save('about', about)} disabled={saving}>Save About</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminPages;
