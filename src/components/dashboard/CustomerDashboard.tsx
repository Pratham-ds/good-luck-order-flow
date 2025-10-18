
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Package, MapPin, Clock, User, LogOut, Plus, RefreshCw } from 'lucide-react';
import OrderHistory from './OrderHistory';
import AddressManager from './AddressManager';
import OrderTracking from './OrderTracking';
import SmartSuggestions from './SmartSuggestions';
import { useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeOrdersCount, setActiveOrdersCount] = useState(0);
  const [savedAddressesCount, setSavedAddressesCount] = useState(0);
  const navigate = useNavigate();

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

   const handleBookService = () => {
    if (user) {
      navigate('/booking');
    } else {
      navigate('/auth');
    }
  };

  // Fetch dashboard counts
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        // Fetch active orders count (non-delivered orders)
        const { count: activeCount, error: ordersError } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .neq('status', 'delivered');

        if (ordersError) throw ordersError;
        setActiveOrdersCount(activeCount || 0);

        // Fetch saved addresses count
        const { count: addressCount, error: addressError } = await supabase
          .from('addresses')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (addressError) throw addressError;
        setSavedAddressesCount(addressCount || 0);
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [user, refreshKey]);

  // Set up real-time subscriptions for orders, addresses, and profiles
  useEffect(() => {
    if (!user) return;

    const ordersChannel = supabase
      .channel('customer-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          setRefreshKey(prev => prev + 1);
        }
      )
      .subscribe();

    const addressesChannel = supabase
      .channel('customer-addresses')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'addresses',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          setRefreshKey(prev => prev + 1);
        }
      )
      .subscribe();

    const trackingChannel = supabase
      .channel('order-tracking')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'order_tracking'
        },
        () => {
          setRefreshKey(prev => prev + 1);
        }
      )
      .subscribe();

    const profilesChannel = supabase
      .channel('customer-profiles')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`
        },
        () => {
          setRefreshKey(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(addressesChannel);
      supabase.removeChannel(trackingChannel);
      supabase.removeChannel(profilesChannel);
    };
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
                <h1 className="text-lg md:text-xl font-bold text-gray-900">Good Luck Drycleaners</h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.user_metadata?.full_name || user?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={handleBookService} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Book Service
              </Button>
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="tracking">Track Orders</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeOrdersCount}</div>
                  <p className="text-xs text-muted-foreground">Currently being processed</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Saved Addresses</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{savedAddressesCount}</div>
                  <p className="text-xs text-muted-foreground">For quick booking</p>
                </CardContent>
              </Card>
            </div>

            <SmartSuggestions />
          </TabsContent>

          <TabsContent value="orders">
            <OrderHistory key={`orders-${refreshKey}`} />
          </TabsContent>

          <TabsContent value="tracking">
            <OrderTracking key={`tracking-${refreshKey}`} />
          </TabsContent>

          <TabsContent value="addresses">
            <AddressManager key={`addresses-${refreshKey}`} />
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <p className="text-sm text-gray-900">{user?.user_metadata?.full_name || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-sm text-gray-900">{user?.user_metadata?.phone || 'Not provided'}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerDashboard;
