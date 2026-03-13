import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-dryclean.png";

const Hero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBookPickup = () => {
    const message = "Hi! I would like to schedule a pickup for my laundry service.";
    const whatsappUrl = `https://wa.me/918171897209?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleViewServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  const stats = [
    { icon: CheckCircle, label: '99% Stain Removal', sub: 'Guaranteed', color: 'text-secondary' },
    { icon: Clock, label: '48hr Service', sub: 'Fast turnaround', color: 'text-secondary' },
    { icon: MapPin, label: 'Free Pickup', sub: '& Delivery', color: 'text-secondary' },
  ];

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-br from-primary via-navy to-navy-light min-h-[90vh] flex items-center">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-secondary rounded-full blur-3xl"></div>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,transparent_30%,hsl(220_60%_12%/0.7))]"></div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-6">
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/15 border border-secondary/25 rounded-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
                <span className="text-secondary text-sm font-medium">Trusted Since 1970 — 50,000+ Happy Customers</span>
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-[1.1] text-primary-foreground">
                Premium{' '}
                <span className="text-gradient-gold">Dry Cleaning</span>
                <br />
                <span className="text-primary-foreground/80">& Laundry Care</span>
              </h1>

              <p className="text-lg text-primary-foreground/65 leading-relaxed max-w-lg font-body">
                Experience meticulous garment care with free pickup & delivery. 
                Your clothes deserve artisan-level attention to detail.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-base px-8 py-6 font-semibold shadow-lg shadow-secondary/25 group"
                onClick={handleBookPickup}
              >
                Book Pickup Now
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-base px-8 py-6 border-secondary bg-secondary/10 text-secondary hover:bg-secondary/20 backdrop-blur-sm"
                onClick={handleViewServices}
              >
                View Services
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              {stats.map((stat, i) => (
                <motion.div 
                  key={i}
                  className="flex items-center space-x-3 p-3 rounded-xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.15 }}
                >
                  <stat.icon className={`w-5 h-5 ${stat.color} flex-shrink-0`} />
                  <div>
                    <p className="font-semibold text-primary-foreground text-sm">{stat.label}</p>
                    <p className="text-xs text-primary-foreground/50">{stat.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="relative hidden lg:block"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent rounded-3xl blur-2xl scale-110"></div>
              <div className="relative bg-primary-foreground/5 backdrop-blur-md rounded-3xl p-3 border border-primary-foreground/10">
                <img 
                  src={heroImage} 
                  alt="Professional dry cleaning services with modern equipment and clean clothes" 
                  className="rounded-2xl w-full h-[480px] object-cover"
                />
              </div>
              <motion.div 
                className="absolute -bottom-6 -left-6 bg-gradient-gold text-secondary-foreground p-5 rounded-2xl shadow-premium-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <p className="font-display font-bold text-xl">Since 1970</p>
                <p className="text-sm opacity-80">Serving with Excellence</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
