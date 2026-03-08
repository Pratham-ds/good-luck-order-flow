import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Sparkles } from 'lucide-react';

const AdminSpecialOffers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: '', description: '', discount_text: '', is_active: true, valid_until: '' });

  const { data: offers = [] } = useQuery({
    queryKey: ['admin-offers'],
    queryFn: async () => {
      const { data, error } = await supabase.from('special_offers').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const resetForm = () => {
    setForm({ title: '', description: '', discount_text: '', is_active: true, valid_until: '' });
    setEditing(null);
  };

  const handleEdit = (o: any) => {
    setEditing(o);
    setForm({ title: o.title, description: o.description || '', discount_text: o.discount_text, is_active: o.is_active, valid_until: o.valid_until || '' });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.discount_text.trim()) {
      toast({ title: "Error", description: "Title and discount text are required", variant: "destructive" });
      return;
    }
    const payload = { ...form, valid_until: form.valid_until || null };
    try {
      if (editing) {
        const { error } = await supabase.from('special_offers').update(payload).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('special_offers').insert(payload);
        if (error) throw error;
      }
      queryClient.invalidateQueries({ queryKey: ['admin-offers'] });
      queryClient.invalidateQueries({ queryKey: ['special-offers'] });
      toast({ title: "Success", description: editing ? "Offer updated" : "Offer added" });
      setOpen(false);
      resetForm();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('special_offers').delete().eq('id', id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ['admin-offers'] });
      queryClient.invalidateQueries({ queryKey: ['special-offers'] });
      toast({ title: "Deleted", description: "Offer removed" });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Special Offers</CardTitle>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="w-4 h-4 mr-2" />Add Offer</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit' : 'Add'} Special Offer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Title *</Label>
                <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Monsoon Sale" />
              </div>
              <div>
                <Label>Discount Text * (shown prominently)</Label>
                <Input value={form.discount_text} onChange={e => setForm({ ...form, discount_text: e.target.value })} placeholder="e.g. 20% OFF" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
              </div>
              <div>
                <Label>Valid Until</Label>
                <Input type="date" value={form.valid_until} onChange={e => setForm({ ...form, valid_until: e.target.value })} />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_active} onCheckedChange={v => setForm({ ...form, is_active: v })} />
                <Label>Active</Label>
              </div>
              <Button onClick={handleSave} className="w-full">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {offers.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No offers yet.</p>
        ) : (
          <div className="space-y-3">
            {offers.map((o: any) => (
              <div key={o.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-secondary" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{o.discount_text}</span>
                      <span className="text-sm text-muted-foreground">— {o.title}</span>
                      {!o.is_active && <span className="text-xs bg-muted px-2 py-0.5 rounded">Hidden</span>}
                    </div>
                    {o.valid_until && <p className="text-xs text-muted-foreground">Until {o.valid_until}</p>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(o)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(o.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminSpecialOffers;
