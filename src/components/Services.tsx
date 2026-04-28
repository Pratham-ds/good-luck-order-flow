import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import dryCleaningIcon from "@/assets/dry-cleaning-icon.png";
import laundryIcon from "@/assets/laundry-icon.png";
import minorRepairIcon from "@/assets/minor-repair-icon.png";
import shoeCleaningIcon from "@/assets/shoe-cleaning-icon.png";
import curtainCleaningIcon from "@/assets/curtain-cleaning-icon.png";
import sofaCleaningIcon from "@/assets/sofa-cleaning-icon.png";

const IMAGE_MAP: Record<string, string> = {
  dry_cleaning: dryCleaningIcon,
  laundry: laundryIcon,
  minor_repair: minorRepairIcon,
  shoe_cleaning: shoeCleaningIcon,
  curtain_cleaning: curtainCleaningIcon,
  sofa_cleaning: sofaCleaningIcon,
};

const Services = () => {
  const queryClient = useQueryClient();
  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return data;
    },
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  React.useEffect(() => {
    const channel = supabase
      .channel('public-services-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, () => {
        queryClient.invalidateQueries({ queryKey: ['services'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const regularServices = services.filter((s: any) => s.category === 'regular');
  const specializedServices = services.filter((s: any) => s.category === 'specialized');

  const handleBookService = (serviceName: string) => {
    const phoneNumber = "918171897209";
    const message = `Hello Good Luck Drycleaners! I would like to book your "${serviceName}" service. Please provide details.`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const ServiceCard = ({ service, showIcon = false, index }: { service: any; showIcon?: boolean; index: number }) => {
    const image = IMAGE_MAP[service.image_key] || laundryIcon;
    const unavailable = !service.is_available;
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08, duration: 0.5 }}
        viewport={{ once: true }}
      >
        <Card className={`group hover:shadow-premium-lg transition-all duration-500 border-border/60 overflow-hidden h-full bg-card ${unavailable ? 'opacity-70' : ''}`}>
          <div className="relative overflow-hidden">
            <img
              src={image}
              alt={service.title}
              className={`w-full h-48 object-contain bg-muted/40 p-6 group-hover:scale-105 transition-transform duration-500 ${unavailable ? 'grayscale' : ''}`}
            />
            <div className="absolute top-4 right-4 bg-gradient-gold text-secondary-foreground px-3 py-1.5 rounded-full font-semibold text-sm shadow-sm">
              {service.price}
            </div>
            {showIcon && service.icon_emoji && (
              <div className="absolute top-4 left-4 text-2xl bg-card rounded-full w-10 h-10 flex items-center justify-center shadow-sm">
                {service.icon_emoji}
              </div>
            )}
            {unavailable && (
              <div className="absolute inset-x-0 bottom-0 bg-destructive/90 text-destructive-foreground text-center py-1.5 text-xs font-semibold uppercase tracking-wide">
                Currently Unavailable
              </div>
            )}
          </div>

          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-display text-card-foreground">{service.title}</CardTitle>
            <p className="text-muted-foreground text-sm">{service.description}</p>
          </CardHeader>

          <CardContent>
            <ul className="space-y-2 mb-6">
              {(service.features || []).map((feature: string, i: number) => (
                <li key={i} className="flex items-center text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full mr-3 flex-shrink-0"></div>
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium disabled:opacity-50"
              onClick={() => handleBookService(service.title)}
              disabled={unavailable}
            >
              {unavailable ? 'Unavailable' : 'Book This Service'}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-secondary font-semibold text-sm uppercase tracking-widest mb-3">What We Offer</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive cleaning services for clothes, footwear, and household items with 99% stain removal guarantee
          </p>
        </motion.div>

        <Tabs defaultValue="regular" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-12 max-w-md mx-auto bg-muted/60">
            <TabsTrigger value="regular" className="text-sm font-medium">Regular Services</TabsTrigger>
            <TabsTrigger value="specialized" className="text-sm font-medium">Specialized Cleaning</TabsTrigger>
          </TabsList>

          <TabsContent value="regular">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularServices.map((service: any, index: number) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="specialized">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {specializedServices.map((service: any, index: number) => (
                <ServiceCard key={service.id} service={service} showIcon={true} index={index} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Services;
