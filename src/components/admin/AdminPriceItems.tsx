import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const CATEGORIES = [
  { value: 'men_wear', label: "Men's Wear" },
  { value: 'women_wear', label: "Women's Wear" },
  { value: 'household', label: "Household Items" },
  { value: 'shoes', label: "Shoe Cleaning" },
];

const AdminPriceItems = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ category: 'men_wear', item_name: '', regular_price: '', offer_price: '', sort_order: 0 });

  const { data: items = [] } = useQuery({
    queryKey: ['admin-price-items'],
    queryFn: async () => {
      const { data, error } = await supabase.from('price_items').select('*').order('sort_order');
      if (error) throw error;
      return data;
    },
  });

  const resetForm = () => {
    setForm({ category: 'men_wear', item_name: '', regular_price: '', offer_price: '', sort_order: 0 });
    setEditing(null);
  };

  const handleEdit = (item: any) => {
    setEditing(item);
    setForm({ category: item.category, item_name: item.item_name, regular_price: item.regular_price, offer_price: item.offer_price, sort_order: item.sort_order });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.item_name.trim() || !form.regular_price.trim() || !form.offer_price.trim()) {
      toast({ title: "Error", description: "All price fields are required", variant: "destructive" });
      return;
    }
    try {
      if (editing) {
        const { error } = await supabase.from('price_items').update(form).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('price_items').insert(form);
        if (error) throw error;
      }
      queryClient.invalidateQueries({ queryKey: ['admin-price-items'] });
      queryClient.invalidateQueries({ queryKey: ['price-items'] });
      toast({ title: "Success", description: editing ? "Item updated" : "Item added" });
      setOpen(false);
      resetForm();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('price_items').delete().eq('id', id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ['admin-price-items'] });
      queryClient.invalidateQueries({ queryKey: ['price-items'] });
      toast({ title: "Deleted", description: "Price item removed" });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Price Management</CardTitle>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="w-4 h-4 mr-2" />Add Item</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit' : 'Add'} Price Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Item Name *</Label>
                <Input value={form.item_name} onChange={e => setForm({ ...form, item_name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Regular Price (₹) *</Label>
                  <Input value={form.regular_price} onChange={e => setForm({ ...form, regular_price: e.target.value })} />
                </div>
                <div>
                  <Label>Offer Price (₹) *</Label>
                  <Input value={form.offer_price} onChange={e => setForm({ ...form, offer_price: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Sort Order</Label>
                <Input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
              </div>
              <Button onClick={handleSave} className="w-full">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="men_wear">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            {CATEGORIES.map(c => <TabsTrigger key={c.value} value={c.value} className="text-xs">{c.label}</TabsTrigger>)}
          </TabsList>
          {CATEGORIES.map(cat => (
            <TabsContent key={cat.value} value={cat.value}>
              {items.filter(i => i.category === cat.value).length === 0 ? (
                <p className="text-muted-foreground text-center py-6">No items in this category</p>
              ) : (
                <div className="space-y-2">
                  {items.filter(i => i.category === cat.value).map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1 grid grid-cols-3 gap-4 items-center">
                        <span className="font-medium">{item.item_name}</span>
                        <span className="text-sm text-muted-foreground text-center line-through">₹{item.regular_price}</span>
                        <span className="text-sm font-semibold text-secondary text-center">₹{item.offer_price}</span>
                      </div>
                      <div className="flex gap-1 ml-4">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminPriceItems;
