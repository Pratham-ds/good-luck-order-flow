
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Package, Calendar, MapPin, RefreshCw, Edit, User } from 'lucide-react';
import { format } from 'date-fns';

interface AdminOrder {
  id: string;
  order_number: string;
  service_type: 'dry_cleaning' | 'laundry' | 'alterations' | 'shoe_cleaning' | 'curtain_cleaning' | 'sofa_cleaning';
  status: 'scheduled' | 'picked_up' | 'in_process' | 'out_for_delivery' | 'delivered';
  total_amount: number;
  created_at: string;
  pickup_date: string;
  delivery_date: string;
  items: any;
  special_instructions: string;
  addresses: {
    title: string;
    street_address: string;
    city: string;
  };
  profiles: {
    full_name: string;
    phone: string;
    email: string;
  };
}

const AdminOrderManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState<AdminOrder | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrders = async () => {
    if (!user) return;

    try {
      // Fetch orders first
      let ordersQuery = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        ordersQuery = ordersQuery.eq('status', statusFilter as any);
      }

      const { data: ordersData, error } = await ordersQuery;

      if (error) throw error;

      // Fetch related data separately
      const ordersWithDetails = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: address } = await supabase
            .from('addresses')
            .select('title, street_address, city')
            .eq('id', order.address_id)
            .single();

          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, phone, email')
            .eq('id', order.user_id)
            .single();

          return {
            ...order,
            addresses: address,
            profiles: profile
          };
        })
      );

      setOrders(ordersWithDetails as AdminOrder[]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: 'scheduled' | 'picked_up' | 'in_process' | 'out_for_delivery' | 'delivered') => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order status updated successfully",
      });

      fetchOrders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const updateOrder = async (orderId: string, updates: any) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order updated successfully",
      });

      setEditingOrder(null);
      fetchOrders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'picked_up': return 'bg-yellow-100 text-yellow-800';
      case 'in_process': return 'bg-purple-100 text-purple-800';
      case 'out_for_delivery': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusOptions = () => [
    'scheduled',
    'picked_up',
    'in_process',
    'out_for_delivery',
    'delivered'
  ];

  useEffect(() => {
    fetchOrders();
  }, [user, statusFilter]);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <div className="flex items-center space-x-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="picked_up">Picked Up</SelectItem>
              <SelectItem value="in_process">In Process</SelectItem>
              <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchOrders} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Order #{order.order_number}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {order.profiles?.full_name || order.profiles?.email}
                    </div>
                    <span>{format(new Date(order.created_at), 'PPP')}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingOrder(order)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Order #{order.order_number}</DialogTitle>
                      </DialogHeader>
                      {editingOrder && (
                        <div className="space-y-4">
                          <div>
                            <Label>Status</Label>
                            <Select 
                              value={editingOrder.status}
                              onValueChange={(value) => setEditingOrder({...editingOrder, status: value as any})}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {getStatusOptions().map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {status.replace('_', ' ').toUpperCase()}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Pickup Date</Label>
                            <Input 
                              type="date"
                              value={editingOrder.pickup_date || ''}
                              onChange={(e) => setEditingOrder({...editingOrder, pickup_date: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label>Delivery Date</Label>
                            <Input 
                              type="date"
                              value={editingOrder.delivery_date || ''}
                              onChange={(e) => setEditingOrder({...editingOrder, delivery_date: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label>Total Amount (₹)</Label>
                            <Input 
                              type="number"
                              value={editingOrder.total_amount || ''}
                              onChange={(e) => setEditingOrder({...editingOrder, total_amount: parseFloat(e.target.value) || 0})}
                            />
                          </div>
                          <div>
                            <Label>Special Instructions</Label>
                            <Input 
                              value={editingOrder.special_instructions || ''}
                              onChange={(e) => setEditingOrder({...editingOrder, special_instructions: e.target.value})}
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline"
                              onClick={() => setEditingOrder(null)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              onClick={() => updateOrder(editingOrder.id, {
                                status: editingOrder.status,
                                pickup_date: editingOrder.pickup_date,
                                delivery_date: editingOrder.delivery_date,
                                total_amount: editingOrder.total_amount,
                                special_instructions: editingOrder.special_instructions
                              })}
                            >
                              Save Changes
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Package className="w-4 h-4 mr-2" />
                    Service: {order.service_type.replace('_', ' ').toUpperCase()}
                  </div>
                  {order.pickup_date && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Pickup: {format(new Date(order.pickup_date), 'PPP')}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {order.addresses?.title} - {order.addresses?.street_address}, {order.addresses?.city}
                  </div>
                  <div className="text-sm text-gray-600">
                    Phone: {order.profiles?.phone || 'Not provided'}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-semibold">₹{order.total_amount || 0}</p>
                  <div className="flex flex-wrap gap-2">
                    {getStatusOptions().map((status) => (
                      <Button
                        key={status}
                        variant={order.status === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, status as any)}
                      >
                        {status.replace('_', ' ').toUpperCase()}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminOrderManagement;
