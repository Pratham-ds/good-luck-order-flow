import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";

const IMAGE_KEYS = [
  { value: 'dry_cleaning', label: 'Dry Cleaning' },
  { value: 'laundry', label: 'Laundry' },
  { value: 'minor_repair', label: 'Minor Repair' },
  { value: 'shoe_cleaning', label: 'Shoe Cleaning' },
  { value: 'curtain_cleaning', label: 'Curtain Cleaning' },
  { value: 'sofa_cleaning', label: 'Sofa Cleaning' },
];

const emptyForm = {
  title: '',
  description: '',
  price: '',
  features: '',
  category: 'regular',
  icon_emoji: '',
  image_key: 'laundry',
  is_available: true,
  is_active: true,
  sort_order: 0,
};

const AdminServices = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(emptyForm);

  const { data: services = [] } = useQuery({
    queryKey: ['admin-services'],
    queryFn: async () => {
      const { data, error } = await supabase.from('services').select('*').order('category').order('sort_order');
      if (error) throw error;
      return data;
    },
  });

  const reset = () => { setForm(emptyForm); setEditing(null); };

  const openEdit = (svc: any) => {
    setEditing(svc);
    setForm({
      title: svc.title,
      description: svc.description,
      price: svc.price,
      features: (svc.features || []).join('\n'),
      category: svc.category,
      icon_emoji: svc.icon_emoji || '',
      image_key: svc.image_key,
      is_available: svc.is_available,
      is_active: svc.is_active,
      sort_order: svc.sort_order,
    });
    setOpen(true);
  };

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-services'] });
    queryClient.invalidateQueries({ queryKey: ['services'] });
  };

  const save = async () => {
    if (!form.title.trim() || !form.description.trim() || !form.price.trim()) {
      toast({ title: 'Error', description: 'Title, description and price are required', variant: 'destructive' });
      return;
    }
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: form.price.trim(),
      features: form.features.split('\n').map((f: string) => f.trim()).filter(Boolean),
      category: form.category,
      icon_emoji: form.icon_emoji || null,
      image_key: form.image_key,
      is_available: form.is_available,
      is_active: form.is_active,
      sort_order: Number(form.sort_order) || 0,
    };
    try {
      if (editing) {
        const { error } = await supabase.from('services').update(payload).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('services').insert(payload);
        if (error) throw error;
      }
      invalidate();
      toast({ title: 'Success', description: editing ? 'Service updated' : 'Service added' });
      setOpen(false); reset();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  const toggleAvailable = async (svc: any) => {
    const { error } = await supabase.from('services').update({ is_available: !svc.is_available }).eq('id', svc.id);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { invalidate(); toast({ title: svc.is_available ? 'Marked unavailable' : 'Marked available' }); }
  };

  const toggleActive = async (svc: any) => {
    const { error } = await supabase.from('services').update({ is_active: !svc.is_active }).eq('id', svc.id);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { invalidate(); toast({ title: svc.is_active ? 'Hidden from site' : 'Shown on site' }); }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { invalidate(); toast({ title: 'Deleted' }); }
  };

  const renderList = (cat: string) => {
    const list = services.filter((s: any) => s.category === cat);
    if (!list.length) return <p className="text-muted-foreground text-center py-6">No services</p>;
    return (
      <div className="space-y-3">
        {list.map((svc: any) => (
          <div key={svc.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold">{svc.title}</span>
                <Badge variant="outline">{svc.price}</Badge>
                {!svc.is_available && <Badge variant="destructive">Unavailable</Badge>}
                {!svc.is_active && <Badge variant="secondary">Hidden</Badge>}
              </div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{svc.description}</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Label className="text-xs">Available</Label>
                <Switch checked={svc.is_available} onCheckedChange={() => toggleAvailable(svc)} />
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-xs">Visible</Label>
                <Switch checked={svc.is_active} onCheckedChange={() => toggleActive(svc)} />
              </div>
              <Button variant="ghost" size="icon" onClick={() => openEdit(svc)}><Pencil className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => remove(svc.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Services Management</CardTitle>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="w-4 h-4 mr-2" />Add Service</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit' : 'Add'} Service</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Title *</Label>
                  <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                </div>
                <div>
                  <Label>Price * (e.g. From ₹100)</Label>
                  <Input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Description *</Label>
                <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
              </div>
              <div>
                <Label>Features (one per line)</Label>
                <Textarea value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} rows={4} placeholder={"Stain Removal\nQuick Turnaround"} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Regular Services</SelectItem>
                      <SelectItem value="specialized">Specialized Cleaning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Image</Label>
                  <Select value={form.image_key} onValueChange={v => setForm({ ...form, image_key: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {IMAGE_KEYS.map(k => <SelectItem key={k.value} value={k.value}>{k.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Icon Emoji (optional)</Label>
                  <Input value={form.icon_emoji} onChange={e => setForm({ ...form, icon_emoji: e.target.value })} placeholder="🧺" />
                </div>
                <div>
                  <Label>Sort Order</Label>
                  <Input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Switch checked={form.is_available} onCheckedChange={v => setForm({ ...form, is_available: v })} />
                  <Label>Available for booking</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={form.is_active} onCheckedChange={v => setForm({ ...form, is_active: v })} />
                  <Label>Show on site</Label>
                </div>
              </div>
              <Button onClick={save} className="w-full">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="regular">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="regular">Regular</TabsTrigger>
            <TabsTrigger value="specialized">Specialized</TabsTrigger>
          </TabsList>
          <TabsContent value="regular">{renderList('regular')}</TabsContent>
          <TabsContent value="specialized">{renderList('specialized')}</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminServices;
