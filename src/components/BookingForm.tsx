import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, MapPin, Package, User, Phone, Clock, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

interface BookingFormProps {
  initialService?: string;
  onSuccess?: () => void;
}

const BookingForm = ({ initialService, onSuccess }: BookingFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [pickupDate, setPickupDate] = useState<Date>();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address_id: '',
    service_type: initialService || '',
    items: [],
    pickup_time: '',
    special_instructions: '',
    estimated_amount: 0
  });

  const serviceItems = {
    dry_cleaning: [
      { name: 'Shirt/T-shirt', price: 80 },
      { name: 'Jacket', price: 200 },
      { name: 'Coat', price: 200 },
      { name: 'Suit 2P', price: 220 },
      { name: 'Suit 3P', price: 310 },
      { name: 'Jeans/Trousers', price: 85 },
      { name: 'Kurta/Pajama', price: 140 }
    ],
    laundry: [
      { name: 'Regular Clothes', price: 50 },
      { name: 'Heavy Items', price: 80 },
      { name: 'Delicate Items', price: 70 }
    ],
    minor_repair: [
      { name: 'Hemming', price: 150 },
      { name: 'Taking In/Out', price: 200 },
      { name: 'Zipper Repair', price: 180 },
      { name: 'Button Replacement', price: 120 }
    ],
    shoe_cleaning: [
      { name: 'Sports Shoes', price: 220 },
      { name: 'Canvas Shoes', price: 200 },
      { name: 'Leather Boots', price: 370 }
    ],
    curtain_cleaning: [
      { name: 'Light Curtains', price: 100 },
      { name: 'Heavy Curtains', price: 150 },
      { name: 'Blackout Curtains', price: 180 }
    ],
    sofa_cleaning: [
      { name: '2-Seater Sofa', price: 800 },
      { name: '3-Seater Sofa', price: 1200 },
      { name: 'Recliner', price: 600 }
    ]
  };

  const timeSlots = [
    '9:00 AM - 11:00 AM',
    '11:00 AM - 1:00 PM',
    '1:00 PM - 3:00 PM',
    '3:00 PM - 5:00 PM',
    '5:00 PM - 7:00 PM'
  ];

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchAddresses();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;
    
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', user.id)
        .single();

      if (profile) {
        setFormData(prev => ({
          ...prev,
          name: profile.full_name || '',
          phone: profile.phone || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchAddresses = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });

      setAddresses(data || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleItemToggle = (item: any, checked: boolean) => {
    setFormData(prev => {
      let newItems = [...prev.items];
      if (checked) {
        newItems.push({ ...item, quantity: 1 });
      } else {
        newItems = newItems.filter(i => i.name !== item.name);
      }
      
      const newAmount = newItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      return {
        ...prev,
        items: newItems,
        estimated_amount: newAmount
      };
    });
  };

  const handleQuantityChange = (itemName: string, quantity: number) => {
    setFormData(prev => {
      const newItems = prev.items.map(item => 
        item.name === itemName ? { ...item, quantity: Math.max(1, quantity) } : item
      );
      
      const newAmount = newItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      return {
        ...prev,
        items: newItems,
        estimated_amount: newAmount
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to place an order.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.phone || !formData.address_id || !formData.service_type || !pickupDate || !formData.pickup_time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.items.length === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select at least one item for the service.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Generate order number
      const orderNumber = 'GL' + Date.now().toString().slice(-8);
      
      // Create order in database
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          address_id: formData.address_id,
          service_type: formData.service_type as any,
          items: formData.items,
          pickup_date: format(pickupDate, 'yyyy-MM-dd'),
          total_amount: formData.estimated_amount,
          special_instructions: formData.special_instructions,
          status: 'scheduled'
        })
        .select()
        .single();

      if (error) throw error;

      // Send WhatsApp message
      const whatsappMessage = `
🏷️ New Order: ${orderNumber}
👤 Customer: ${formData.name}
📞 Phone: ${formData.phone}
📅 Pickup: ${format(pickupDate, 'PPP')} (${formData.pickup_time})
🧼 Service: ${formData.service_type.replace('_', ' ')}
📦 Items: ${formData.items.map(item => `${item.name} x${item.quantity}`).join(', ')}
💰 Estimated Amount: ₹${formData.estimated_amount}
${formData.special_instructions ? `📝 Instructions: ${formData.special_instructions}` : ''}
      `.trim();

      const whatsappUrl = `https://wa.me/918171647906?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, '_blank');

      toast({
        title: "Order Placed Successfully!",
        description: `Your order ${orderNumber} has been confirmed. You will receive updates on WhatsApp.`,
      });

      // Reset form
      setFormData(prev => ({
        ...prev,
        service_type: '',
        items: [],
        pickup_time: '',
        special_instructions: '',
        estimated_amount: 0
      }));
      setPickupDate(undefined);

      if (onSuccess) onSuccess();

    } catch (error: any) {
      console.error('Error placing order:', error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const currentItems = formData.service_type ? serviceItems[formData.service_type] || [] : [];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <Package className="w-6 h-6 mr-2" />
          Book Our Service
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">
                <User className="w-4 h-4 inline mr-2" />
                Full Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number *
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>

          {/* Address Selection */}
          <div>
            <Label>
              <MapPin className="w-4 h-4 inline mr-2" />
              Pickup Address *
            </Label>
            <Select 
              value={formData.address_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, address_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select pickup address" />
              </SelectTrigger>
              <SelectContent>
                {addresses.map((address: any) => (
                  <SelectItem key={address.id} value={address.id}>
                    {address.title} - {address.street_address}, {address.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Service Type */}
          <div>
            <Label>Service Type *</Label>
            <Select 
              value={formData.service_type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, service_type: value, items: [], estimated_amount: 0 }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dry_cleaning">Dry Cleaning</SelectItem>
                <SelectItem value="laundry">Laundry</SelectItem>
                <SelectItem value="minor_repair">Minor Repair</SelectItem>
                <SelectItem value="shoe_cleaning">Shoe Cleaning</SelectItem>
                <SelectItem value="curtain_cleaning">Curtain Cleaning</SelectItem>
                <SelectItem value="sofa_cleaning">Sofa Cleaning</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Items Selection */}
          {currentItems.length > 0 && (
            <div>
              <Label className="text-base font-semibold">Select Items *</Label>
              <div className="grid md:grid-cols-2 gap-3 mt-3">
                {currentItems.map((item, index) => {
                  const selectedItem = formData.items.find(i => i.name === item.name);
                  return (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={!!selectedItem}
                          onCheckedChange={(checked) => handleItemToggle(item, !!checked)}
                        />
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm text-gray-600">₹{item.price}</span>
                      </div>
                      {selectedItem && (
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item.name, selectedItem.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{selectedItem.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item.name, selectedItem.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pickup Date & Time */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>
                <CalendarIcon className="w-4 h-4 inline mr-2" />
                Pickup Date *
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    {pickupDate ? format(pickupDate, "PPP") : "Select pickup date"}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={pickupDate}
                    onSelect={setPickupDate}
                    disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>
                <Clock className="w-4 h-4 inline mr-2" />
                Pickup Time *
              </Label>
              <Select 
                value={formData.pickup_time} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, pickup_time: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select pickup time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <Label htmlFor="instructions">
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Special Instructions (Optional)
            </Label>
            <Textarea
              id="instructions"
              value={formData.special_instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, special_instructions: e.target.value }))}
              placeholder="Any special instructions for handling your items..."
              rows={3}
            />
          </div>

          {/* Order Summary */}
          {formData.items.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Order Summary</h3>
              <div className="space-y-1">
                {formData.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="border-t pt-2 font-semibold flex justify-between">
                  <span>Estimated Total:</span>
                  <span>₹{formData.estimated_amount}</span>
                </div>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Placing Order..." : "Place Order"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;