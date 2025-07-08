
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { User, Phone, Mail, MapPin, RefreshCw } from 'lucide-react';
import AdminCustomerEntry from './AdminCustomerEntry';

interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
  order_count: number;
  total_spent: number;
  addresses: Array<{
    title: string;
    street_address: string;
    city: string;
  }>;
}

const AdminCustomers = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    if (!user) return;

    try {
      // Fetch profiles first
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'customer');

      if (profilesError) throw profilesError;

      // Fetch addresses separately for each profile
      const customersWithAddresses = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: addresses } = await supabase
            .from('addresses')
            .select('title, street_address, city')
            .eq('user_id', profile.id);
          
          return {
            ...profile,
            addresses: addresses || []
          };
        })
      );

      // Get order statistics for each customer
      const customersWithStats = await Promise.all(
        customersWithAddresses.map(async (profile) => {
          const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('total_amount')
            .eq('user_id', profile.id);

          if (ordersError) {
            console.error('Error fetching orders for customer:', ordersError);
            return {
              ...profile,
              order_count: 0,
              total_spent: 0
            };
          }

          const orderCount = orders?.length || 0;
          const totalSpent = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

          return {
            ...profile,
            order_count: orderCount,
            total_spent: totalSpent
          };
        })
      );

      setCustomers(customersWithStats);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch customers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [user]);

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
        <h2 className="text-2xl font-bold">Customer Management</h2>
        <div className="flex items-center space-x-2">
          <AdminCustomerEntry />
          <Button onClick={fetchCustomers} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {customers.map((customer) => (
          <Card key={customer.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{customer.full_name || 'Unnamed Customer'}</CardTitle>
                    <p className="text-sm text-gray-600">
                      Member since {new Date(customer.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-600">₹{customer.total_spent}</p>
                  <p className="text-sm text-gray-600">{customer.order_count} orders</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {customer.email}
                  </div>
                  {customer.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {customer.phone}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  {customer.addresses && customer.addresses.length > 0 ? (
                    customer.addresses.map((address, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {address.title}: {address.street_address}, {address.city}
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-2" />
                      No addresses saved
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminCustomers;
