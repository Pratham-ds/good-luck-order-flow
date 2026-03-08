
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { LogOut, Settings, Users, Package, TrendingUp, Clock, CheckCircle, MessageSquare, Sparkles, DollarSign } from 'lucide-react';
import AdminOrderManagement from './AdminOrderManagement';
import AdminCustomers from './AdminCustomers';
import AdminSettings from './AdminSettings';
import AdminTestimonials from './AdminTestimonials';
import AdminSpecialOffers from './AdminSpecialOffers';
import AdminPriceItems from './AdminPriceItems';

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('orders');
  const [orderStats, setOrderStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    pending: 0
  });

  const fetchOrderStats = async () => {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('status');

      if (error) throw error;

      const stats = {
        total: orders?.length || 0,
        active: orders?.filter(o => ['scheduled', 'picked_up', 'in_process', 'out_for_delivery'].includes(o.status)).length || 0,
        completed: orders?.filter(o => o.status === 'delivered').length || 0,
        pending: orders?.filter(o => o.status === 'scheduled').length || 0
      };

      setOrderStats(stats);
    } catch (error) {
      console.error('Error fetching order stats:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrderStats();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/c38313f8-3060-4373-8bf7-4b20c9a6b26d.png" 
                  alt="Good Luck Drycleaners Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-gray-900">Good Luck Drycleaners - Admin Panel</h1>
                <p className="text-sm text-gray-600">Welcome, {user?.user_metadata?.full_name || user?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Order Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderStats.total}</div>
              <p className="text-xs text-muted-foreground">All time orders</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{orderStats.active}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Pickup</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{orderStats.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting pickup</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{orderStats.completed}</div>
              <p className="text-xs text-muted-foreground">Delivered orders</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">
              <Package className="w-4 h-4 mr-2" />
              Order Management
            </TabsTrigger>
            <TabsTrigger value="customers">
              <Users className="w-4 h-4 mr-2" />
              Customers
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <AdminOrderManagement onOrderUpdate={fetchOrderStats} />
          </TabsContent>

          <TabsContent value="customers">
            <AdminCustomers />
          </TabsContent>

          <TabsContent value="settings">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
