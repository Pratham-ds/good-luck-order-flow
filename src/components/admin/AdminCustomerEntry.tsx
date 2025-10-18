import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Package } from 'lucide-react';

const AdminCustomerEntry = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    service_type: '',
    items: '',
    pickup_date: '',
    delivery_date: '',
    total_amount: '',
    special_instructions: '',
    address_title: '',
    street_address: '',
    city: '',
    state: 'Maharashtra',
    postal_code: ''
  });

  const serviceTypes = [
    { value: 'dry_cleaning', label: 'Dry Cleaning' },
    { value: 'laundry', label: 'Laundry' },
    { value: 'minor_repair', label: 'Minor Repair' },
    { value: 'shoe_cleaning', label: 'Shoe Cleaning' },
    { value: 'curtain_cleaning', label: 'Curtain Cleaning' },
    { value: 'sofa_cleaning', label: 'Sofa Cleaning' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const createCustomerAndOrder = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Check if user already exists
      let customerId;
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', formData.email)
        .single();

      if (existingProfile) {
        customerId = existingProfile.id;
        // Update existing profile
        await supabase
          .from('profiles')
          .update({
            full_name: formData.full_name,
            phone: formData.phone
          })
          .eq('id', customerId);
      } else {
        // Create new user in auth.users (this would normally be done through signup)
        // For admin entry, we'll create the profile directly with a generated UUID
        const profileId = crypto.randomUUID();
        const { data: newProfile, error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: profileId,
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone
          })
          .select()
          .single();

        if (profileError) throw profileError;
        customerId = newProfile.id;
      }

      // Create or update address
      let addressId;
      const { data: existingAddress } = await supabase
        .from('addresses')
        .select('id')
        .eq('user_id', customerId)
        .eq('title', formData.address_title)
        .single();

      if (existingAddress) {
        addressId = existingAddress.id;
        await supabase
          .from('addresses')
          .update({
            street_address: formData.street_address,
            city: formData.city,
            state: formData.state,
            postal_code: formData.postal_code
          })
          .eq('id', addressId);
      } else {
        const { data: newAddress, error: addressError } = await supabase
          .from('addresses')
          .insert({
            user_id: customerId,
            title: formData.address_title,
            street_address: formData.street_address,
            city: formData.city,
            state: formData.state,
            postal_code: formData.postal_code,
            is_default: true
          })
          .select()
          .single();

        if (addressError) throw addressError;
        addressId = newAddress.id;
      }

      // Generate order number
      const { data: orderNumber } = await supabase.rpc('generate_order_number');

      // Create order
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: customerId,
          address_id: addressId,
          order_number: orderNumber,
          service_type: formData.service_type as 'dry_cleaning' | 'laundry' | 'minor_repair' | 'shoe_cleaning' | 'curtain_cleaning' | 'sofa_cleaning',
          items: { description: formData.items },
          pickup_date: formData.pickup_date || null,
          delivery_date: formData.delivery_date || null,
          total_amount: parseFloat(formData.total_amount) || null,
          special_instructions: formData.special_instructions || null,
          status: 'scheduled' as 'scheduled'
        });

      if (orderError) throw orderError;

      toast({
        title: "Success",
        description: "Customer and order created successfully",
      });

      // Reset form
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        service_type: '',
        items: '',
        pickup_date: '',
        delivery_date: '',
        total_amount: '',
        special_instructions: '',
        address_title: '',
        street_address: '',
        city: '',
        state: 'Maharashtra',
        postal_code: ''
      });
      setIsOpen(false);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create customer and order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Customer & Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Customer & Order Entry</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <UserPlus className="w-5 h-5 mr-2" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter email"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Address Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="address_title">Address Title *</Label>
                  <Input
                    id="address_title"
                    value={formData.address_title}
                    onChange={(e) => handleInputChange('address_title', e.target.value)}
                    placeholder="e.g., Home, Office"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Enter city"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="street_address">Street Address *</Label>
                <Input
                  id="street_address"
                  value={formData.street_address}
                  onChange={(e) => handleInputChange('street_address', e.target.value)}
                  placeholder="Enter street address"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="State"
                  />
                </div>
                <div>
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input
                    id="postal_code"
                    value={formData.postal_code}
                    onChange={(e) => handleInputChange('postal_code', e.target.value)}
                    placeholder="Enter postal code"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="service_type">Service Type *</Label>
                <Select value={formData.service_type} onValueChange={(value) => handleInputChange('service_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((service) => (
                      <SelectItem key={service.value} value={service.value}>
                        {service.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="items">Items Description *</Label>
                <Textarea
                  id="items"
                  value={formData.items}
                  onChange={(e) => handleInputChange('items', e.target.value)}
                  placeholder="Describe the items (e.g., 2 shirts, 1 jacket, 3 trousers)"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pickup_date">Pickup Date</Label>
                  <Input
                    id="pickup_date"
                    type="date"
                    value={formData.pickup_date}
                    onChange={(e) => handleInputChange('pickup_date', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="delivery_date">Delivery Date</Label>
                  <Input
                    id="delivery_date"
                    type="date"
                    value={formData.delivery_date}
                    onChange={(e) => handleInputChange('delivery_date', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="total_amount">Total Amount (₹)</Label>
                <Input
                  id="total_amount"
                  type="number"
                  value={formData.total_amount}
                  onChange={(e) => handleInputChange('total_amount', e.target.value)}
                  placeholder="Enter total amount"
                />
              </div>
              <div>
                <Label htmlFor="special_instructions">Special Instructions</Label>
                <Textarea
                  id="special_instructions"
                  value={formData.special_instructions}
                  onChange={(e) => handleInputChange('special_instructions', e.target.value)}
                  placeholder="Any special instructions for the order"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={createCustomerAndOrder}
              disabled={loading || !formData.full_name || !formData.email || !formData.service_type || !formData.items}
            >
              {loading ? "Creating..." : "Create Customer & Order"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminCustomerEntry;