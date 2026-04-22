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

const AdminSettings = () => {
  const { toast } = useToast();
  const { settings, loading } = useSiteSettings();
  const [saving, setSaving] = useState(false);

  // Local editable copies
  const [header, setHeader] = useState<any>(null);
  const [footer, setFooter] = useState<any>(null);
  const [contact, setContact] = useState<any>(null);
  const [social, setSocial] = useState<any>(null);
  const [seo, setSeo] = useState<any>(null);

  // Initialize once settings load
  if (!loading && header === null) {
    setHeader(structuredClone(settings.header));
    setFooter(structuredClone(settings.footer));
    setContact(structuredClone(settings.contact));
    setSocial(structuredClone(settings.social));
    setSeo(structuredClone(settings.seo));
  }

  const save = async (key: string, value: any) => {
    try {
      setSaving(true);
      await saveSiteSetting(key, value);
      toast({ title: 'Saved', description: `${key} updated.` });
    } catch (e: any) {
      toast({ title: 'Save failed', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !header) return <AdminLayout title="Site Settings"><div>Loading…</div></AdminLayout>;

  return (
    <AdminLayout title="Site Settings">
      <Tabs defaultValue="header">
        <TabsList className="mb-6 flex-wrap">
          <TabsTrigger value="header">Header / Nav</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="seo">SEO Defaults</TabsTrigger>
        </TabsList>

        {/* HEADER */}
        <TabsContent value="header">
          <Card className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Logo Text (Pink)</Label>
                <Input value={header.logoTextPink} onChange={(e) => setHeader({ ...header, logoTextPink: e.target.value })} />
              </div>
              <div>
                <Label>Logo Text (Cyan)</Label>
                <Input value={header.logoTextCyan} onChange={(e) => setHeader({ ...header, logoTextCyan: e.target.value })} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Navigation Links</Label>
                <Button size="sm" variant="outline" onClick={() => setHeader({ ...header, navLinks: [...(header.navLinks || []), { name: 'New', href: '/' }] })}>
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
              <div className="space-y-2">
                {(header.navLinks || []).map((link: any, i: number) => (
                  <div key={i} className="flex gap-2">
                    <Input placeholder="Name" value={link.name} onChange={(e) => {
                      const next = [...header.navLinks]; next[i] = { ...next[i], name: e.target.value }; setHeader({ ...header, navLinks: next });
                    }} />
                    <Input placeholder="/path" value={link.href} onChange={(e) => {
                      const next = [...header.navLinks]; next[i] = { ...next[i], href: e.target.value }; setHeader({ ...header, navLinks: next });
                    }} />
                    <Button size="icon" variant="ghost" onClick={() => setHeader({ ...header, navLinks: header.navLinks.filter((_: any, j: number) => j !== i) })}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <Button onClick={() => save('header', header)} disabled={saving}>Save Header</Button>
          </Card>
        </TabsContent>

        {/* FOOTER */}
        <TabsContent value="footer">
          <Card className="p-6 space-y-4">
            <div><Label>Tagline</Label><Input value={footer.tagline} onChange={(e) => setFooter({ ...footer, tagline: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Customer count</Label><Input value={footer.customers} onChange={(e) => setFooter({ ...footer, customers: e.target.value })} /></div>
              <div><Label>Founded year</Label><Input type="number" value={footer.founded} onChange={(e) => setFooter({ ...footer, founded: Number(e.target.value) })} /></div>
            </div>
            <div><Label>Copyright text</Label><Input value={footer.copyright} onChange={(e) => setFooter({ ...footer, copyright: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Powered By label</Label><Input value={footer.poweredBy} onChange={(e) => setFooter({ ...footer, poweredBy: e.target.value })} /></div>
              <div><Label>Powered By URL</Label><Input value={footer.poweredByUrl} onChange={(e) => setFooter({ ...footer, poweredByUrl: e.target.value })} /></div>
            </div>
            <Button onClick={() => save('footer', footer)} disabled={saving}>Save Footer</Button>
          </Card>
        </TabsContent>

        {/* CONTACT */}
        <TabsContent value="contact">
          <Card className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Main Phone</Label><Input value={contact.mainPhone} onChange={(e) => setContact({ ...contact, mainPhone: e.target.value })} /></div>
              <div><Label>Email</Label><Input value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} /></div>
            </div>
            <div><Label>WhatsApp Number (digits only, e.g. 919991483279)</Label><Input value={contact.whatsapp} onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })} /></div>
            <div><Label>Full Address</Label><Textarea value={contact.fullAddress} onChange={(e) => setContact({ ...contact, fullAddress: e.target.value })} /></div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>All Phone Numbers</Label>
                <Button size="sm" variant="outline" onClick={() => setContact({ ...contact, phones: [...(contact.phones || []), ''] })}>
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
              {(contact.phones || []).map((p: string, i: number) => (
                <div key={i} className="flex gap-2 mb-2">
                  <Input value={p} onChange={(e) => {
                    const next = [...contact.phones]; next[i] = e.target.value; setContact({ ...contact, phones: next });
                  }} />
                  <Button size="icon" variant="ghost" onClick={() => setContact({ ...contact, phones: contact.phones.filter((_: any, j: number) => j !== i) })}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
            <Button onClick={() => save('contact', contact)} disabled={saving}>Save Contact</Button>
          </Card>
        </TabsContent>

        {/* SOCIAL */}
        <TabsContent value="social">
          <Card className="p-6 space-y-4">
            <div><Label>Instagram URL</Label><Input value={social.instagram} onChange={(e) => setSocial({ ...social, instagram: e.target.value })} /></div>
            <div><Label>YouTube URL</Label><Input value={social.youtube} onChange={(e) => setSocial({ ...social, youtube: e.target.value })} /></div>
            <div><Label>WhatsApp link</Label><Input value={social.whatsapp} onChange={(e) => setSocial({ ...social, whatsapp: e.target.value })} /></div>
            <Button onClick={() => save('social', social)} disabled={saving}>Save Social</Button>
          </Card>
        </TabsContent>

        {/* SEO */}
        <TabsContent value="seo">
          <Card className="p-6 space-y-4">
            <div><Label>Site Name</Label><Input value={seo.siteName} onChange={(e) => setSeo({ ...seo, siteName: e.target.value })} /></div>
            <div><Label>Default Title</Label><Input value={seo.defaultTitle} onChange={(e) => setSeo({ ...seo, defaultTitle: e.target.value })} /></div>
            <div><Label>Default Description</Label><Textarea value={seo.defaultDescription} onChange={(e) => setSeo({ ...seo, defaultDescription: e.target.value })} /></div>
            <div><Label>Default Keywords (comma-separated)</Label><Input value={seo.defaultKeywords} onChange={(e) => setSeo({ ...seo, defaultKeywords: e.target.value })} /></div>
            <div><Label>Site URL</Label><Input value={seo.siteUrl} onChange={(e) => setSeo({ ...seo, siteUrl: e.target.value })} /></div>
            <div><Label>Default OG Image URL</Label><Input value={seo.ogImage} onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })} /></div>
            <Button onClick={() => save('seo', seo)} disabled={saving}>Save SEO Defaults</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminSettings;
