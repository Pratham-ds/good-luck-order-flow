
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import dryCleaningIcon from "@/assets/dry-cleaning-icon.png";
import laundryIcon from "@/assets/laundry-icon.png";
import minorRepairIcon from "@/assets/minor-repair-icon.png";
import shoeCleaningIcon from "@/assets/shoe-cleaning-icon.png";
import curtainCleaningIcon from "@/assets/curtain-cleaning-icon.png";
import sofaCleaningIcon from "@/assets/sofa-cleaning-icon.png";

const Services = () => {
  const regularServices = [
    { title: "Dry Cleaning", description: "Professional dry cleaning for delicate fabrics and formal wear", price: "From ₹80", features: ["Suits & Dresses", "Delicate Fabrics", "Stain Removal", "Press & Finish"], image: dryCleaningIcon },
    { title: "Wash & Fold", description: "Complete washing, drying, and folding service for everyday clothes", price: "From ₹50/kg", features: ["Washing & Drying", "Folding", "Fabric Softener", "Same Day Service"], image: laundryIcon },
    { title: "Ironing & Pressing", description: "Professional pressing for crisp, wrinkle-free clothing", price: "From ₹30", features: ["Professional Press", "Starch Options", "Hanger Service", "Quick Turnaround"], image: laundryIcon },
    { title: "Minor Repair", description: "Expert minor repairs and tailoring for the perfect fit", price: "From ₹150", features: ["Hemming", "Taking In/Out", "Zipper Repair", "Custom Fitting"], image: minorRepairIcon },
    { title: "Comforters & Bedding", description: "Large item cleaning for comforters, blankets, and bedding", price: "From ₹250", features: ["Comforters", "Blankets", "Pillows", "Curtains"], image: laundryIcon },
    { title: "Wedding Dress Care", description: "Specialized cleaning and preservation for wedding dresses", price: "From ₹1500", features: ["Cleaning", "Preservation", "Storage Box", "Stain Treatment"], image: dryCleaningIcon }
  ];

  const specializedServices = [
    { title: "Shoe & Boot Cleaning", description: "Professional cleaning for all types of footwear", price: "From ₹100", features: ["Sports Shoes", "Leather Boots", "Branded Footwear", "Deep Cleaning"], image: shoeCleaningIcon, icon: "👟" },
    { title: "Carpet Cleaning", description: "Deep cleaning and stain removal for all carpet types", price: "From ₹200/sqm", features: ["Deep Steam Cleaning", "Stain Removal", "Odor Treatment", "Quick Drying"], image: laundryIcon, icon: "🧽" },
    { title: "Curtain Cleaning", description: "Gentle cleaning for all types of curtains and drapes", price: "From ₹150/panel", features: ["Delicate Fabric Care", "Colour Protection", "Wrinkle-Free", "UV Protection"], image: curtainCleaningIcon, icon: "🪟" },
    { title: "Sofa Cleaning", description: "Professional upholstery cleaning for sofas and furniture", price: "From ₹800", features: ["Fabric & Leather", "Deep Sanitization", "Stain Removal", "Odor Elimination"], image: sofaCleaningIcon, icon: "🛋️" },
    { title: "Mat Cleaning", description: "Thorough cleaning for doormats, bath mats, and floor mats", price: "From ₹80", features: ["All Mat Types", "Antibacterial Treatment", "Quick Drying", "Odor Removal"], image: laundryIcon, icon: "🏠" },
    { title: "Household Fabric Items", description: "Cleaning service for various household fabric items", price: "From ₹50", features: ["Table Covers", "Cushion Covers", "Blankets", "Custom Items"], image: laundryIcon, icon: "🏡" }
  ];

  const handleBookService = (serviceName: string) => {
    const phoneNumber = "918171897209";
    const message = `Hello Good Luck Drycleaners! I would like to book your "${serviceName}" service. Please provide details.`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const ServiceCard = ({ service, showIcon = false, index }: { service: any, showIcon?: boolean, index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="group hover:shadow-premium-lg transition-all duration-500 border-border/60 overflow-hidden h-full bg-card">
        <div className="relative overflow-hidden">
          <img 
            src={service.image} 
            alt={service.title}
            className="w-full h-48 object-contain bg-muted/40 p-6 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 right-4 bg-gradient-gold text-secondary-foreground px-3 py-1.5 rounded-full font-semibold text-sm shadow-sm">
            {service.price}
          </div>
          {showIcon && (
            <div className="absolute top-4 left-4 text-2xl bg-card rounded-full w-10 h-10 flex items-center justify-center shadow-sm">
              {service.icon}
            </div>
          )}
        </div>
        
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-display text-card-foreground">{service.title}</CardTitle>
          <p className="text-muted-foreground text-sm">{service.description}</p>
        </CardHeader>
        
        <CardContent>
          <ul className="space-y-2 mb-6">
            {service.features.map((feature: string, featureIndex: number) => (
              <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 bg-secondary rounded-full mr-3 flex-shrink-0"></div>
                {feature}
              </li>
            ))}
          </ul>
          <Button 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
            onClick={() => handleBookService(service.title)}
          >
            Book This Service
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );

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
              {regularServices.map((service, index) => (
                <ServiceCard key={index} service={service} index={index} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="specialized">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {specializedServices.map((service, index) => (
                <ServiceCard key={index} service={service} showIcon={true} index={index} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Services;
