import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Shirt, Crown, Home, HeartHandshake } from 'lucide-react';
import { motion } from "framer-motion";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const CATEGORIES = [
  { value: 'men_wear', icon: Shirt, iconBg: 'bg-primary/10', iconColor: 'text-primary', title: "Men's Wear", subtitle: "Professional dry cleaning for men's clothing" },
  { value: 'women_wear', icon: Crown, iconBg: 'bg-secondary/10', iconColor: 'text-secondary', title: "Women's Wear", subtitle: "Delicate care for women's garments" },
  { value: 'household', icon: Home, iconBg: 'bg-primary/10', iconColor: 'text-primary', title: "Household Items", subtitle: "Complete home textile care services" },
  { value: 'shoes', icon: HeartHandshake, iconBg: 'bg-secondary/10', iconColor: 'text-secondary', title: "👟 Shoe Cleaning", subtitle: "Professional shoe cleaning and restoration" },
];

const PricePlans = () => {
  const { data: priceItems = [] } = useQuery({
    queryKey: ['price-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('price_items')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      return data;
    },
  });

  const PriceTable = ({ data, icon: Icon, title }: { data: any[], icon: any, title: string }) => (
    <Card className="border-border/40 shadow-premium">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
            <Icon className="w-5 h-5 text-secondary" />
          </div>
          <CardTitle className="text-lg font-display">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left py-3 px-2 font-semibold text-foreground text-sm">Item</th>
                <th className="text-center py-3 px-2 font-semibold text-muted-foreground text-sm">Regular (₹)</th>
                <th className="text-center py-3 px-2 font-semibold text-secondary text-sm">Offer (₹)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="border-b border-border/40 hover:bg-muted/40 transition-colors">
                  <td className="py-3 px-2 font-medium text-foreground">{row.item_name}</td>
                  <td className="py-3 px-2 text-center text-muted-foreground line-through">{row.regular_price}</td>
                  <td className="py-3 px-2 text-center text-secondary font-semibold">{row.offer_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div id="price-plans" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-secondary font-semibold text-sm uppercase tracking-widest mb-3">Transparent Pricing</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">Our Price Plans</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transparent pricing for every fabric and every home
          </p>
        </motion.div>

        <Accordion type="single" collapsible defaultValue="men_wear" className="space-y-4 max-w-4xl mx-auto">
          {CATEGORIES.map((cat) => {
            const catItems = priceItems.filter(i => i.category === cat.value);
            if (catItems.length === 0) return null;
            return (
              <AccordionItem key={cat.value} value={cat.value} className="border border-border/40 rounded-2xl px-4 overflow-hidden bg-card shadow-premium data-[state=open]:shadow-premium-lg transition-shadow">
                <AccordionTrigger className="hover:no-underline py-5">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${cat.iconBg} rounded-xl flex items-center justify-center`}>
                      <cat.icon className={`w-6 h-6 ${cat.iconColor}`} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-display font-bold text-foreground">{cat.title}</h3>
                      <p className="text-sm text-muted-foreground">{cat.subtitle}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <PriceTable data={catItems} icon={cat.icon} title={`${cat.title} Pricing`} />
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-lg font-display font-semibold text-foreground mb-2">Special Offers Available!</h3>
            <p className="text-muted-foreground">
              Enjoy our discounted rates on all services. Prices may vary based on fabric type and condition.
              Contact us for bulk orders and additional discounts.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PricePlans;
