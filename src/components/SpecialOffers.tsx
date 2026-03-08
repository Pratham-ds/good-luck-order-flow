import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Clock } from 'lucide-react';
import { motion } from "framer-motion";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

const SpecialOffers = () => {
  const { data: offers = [] } = useQuery({
    queryKey: ['special-offers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('special_offers')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (offers.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-secondary/10 via-background to-primary/5">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            Today's Special
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Special Offers</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="border-secondary/30 bg-card shadow-premium overflow-hidden group hover:shadow-premium-lg transition-all duration-500">
                <div className="h-1.5 bg-gradient-gold" />
                <CardContent className="p-6">
                  <div className="text-3xl font-display font-bold text-secondary mb-2">{offer.discount_text}</div>
                  <h3 className="text-lg font-display font-semibold text-foreground mb-2">{offer.title}</h3>
                  {offer.description && (
                    <p className="text-muted-foreground text-sm mb-3">{offer.description}</p>
                  )}
                  {offer.valid_until && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      Valid until {format(new Date(offer.valid_until), 'dd MMM yyyy')}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;
