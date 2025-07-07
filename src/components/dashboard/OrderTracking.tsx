
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Package, Clock, CheckCircle, Truck, Home } from 'lucide-react';
import { format } from 'date-fns';

interface OrderWithTracking {
  id: string;
  order_number: string;
  service_type: string;
  status: string;
  created_at: string;
  pickup_date: string;
  delivery_date: string;
  order_tracking: Array<{
    status: string;
    notes: string;
    created_at: string;
  }>;
  addresses: {
    title: string;
    street_address: string;
    city: string;
  };
}

const OrderTracking = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderWithTracking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActiveOrders = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          addresses (
            title,
            street_address,
            city
          ),
          order_tracking (
            status,
            notes,
            created_at
          )
        `)
        .eq('user_id', user.id)
        .neq('status', 'delivered')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch order tracking",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="w-5 h-5 text-blue-600" />;
      case 'picked_up': return <Package className="w-5 h-5 text-yellow-600" />;
      case 'in_process': return <Package className="w-5 h-5 text-purple-600" />;
      case 'out_for_delivery': return <Truck className="w-5 h-5 text-orange-600" />;
      case 'delivered': return <CheckCircle className="w-5 h-5 text-green-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
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

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'scheduled': return 20;
      case 'picked_up': return 40;
      case 'in_process': return 60;
      case 'out_for_delivery': return 80;
      case 'delivered': return 100;
      default: return 0;
    }
  };

  useEffect(() => {
    fetchActiveOrders();
    
    // Set up real-time updates
    const channel = supabase
      .channel('order-tracking-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'order_tracking'
        },
        () => {
          fetchActiveOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Track Your Orders</h2>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No active orders</h3>
            <p className="text-gray-600">All your orders have been delivered or you haven't placed any orders yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Order #{order.order_number}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {order.service_type.replace('_', ' ').toUpperCase()}
                    </p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Order Progress</span>
                    <span>{getProgressPercentage(order.status)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage(order.status)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Status Updates</h4>
                  {order.order_tracking.length > 0 ? (
                    <div className="space-y-3">
                      {order.order_tracking
                        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                        .map((tracking, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          {getStatusIcon(tracking.status)}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">
                                {tracking.status.replace('_', ' ').toUpperCase()}
                              </span>
                              <span className="text-sm text-gray-500">
                                {format(new Date(tracking.created_at), 'PPp')}
                              </span>
                            </div>
                            {tracking.notes && (
                              <p className="text-sm text-gray-600 mt-1">{tracking.notes}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">No tracking updates yet.</p>
                  )}
                </div>

                {/* Delivery Address */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Delivery Address</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Home className="w-4 h-4" />
                    <span>
                      {order.addresses?.title} - {order.addresses?.street_address}, {order.addresses?.city}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
