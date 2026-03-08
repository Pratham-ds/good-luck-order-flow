
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, MapPin, Clock, Mail, ArrowRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappMessage = `Hi! I'm ${formData.name}. Phone: ${formData.phone}${formData.email ? `, Email: ${formData.email}` : ''}. Message: ${formData.message}`;
    window.open(`https://wa.me/918171897209?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
    toast({ title: "Message Sent!", description: "Your message has been sent via WhatsApp." });
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const contactInfo = [
    { icon: Phone, title: 'Phone & WhatsApp', content: '+91 8171897209', action: { label: 'Chat on WhatsApp →', onClick: () => window.open('https://wa.me/918171897209?text=Hi! I would like to know more about your services.', '_blank') }, bg: 'bg-secondary/10', iconColor: 'text-secondary' },
    { icon: Mail, title: 'Email Support', content: 'info@goodluckdryclean.com', action: { label: 'Send Email →', href: 'mailto:info@goodluckdryclean.com' }, bg: 'bg-primary/5', iconColor: 'text-primary' },
    { icon: MapPin, title: 'Address', content: 'Ambar Road, Malviya Marg\nnear Barh Ka Ped\nBulandshahr', bg: 'bg-secondary/10', iconColor: 'text-secondary' },
    { icon: Clock, title: 'Business Hours', content: 'Tuesday - Sunday: 10:00 AM - 9:00 PM', extra: 'Closed on Monday', bg: 'bg-primary/5', iconColor: 'text-primary' },
  ];

  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-secondary font-semibold text-sm uppercase tracking-widest mb-3">Get In Touch</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">Contact Us</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to experience premium cleaning services? Contact us today to schedule your pickup!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((info, i) => (
              <motion.div 
                key={i}
                className="flex items-start space-x-4 p-5 bg-card rounded-2xl border border-border/40 shadow-premium hover:shadow-premium-lg transition-all duration-300"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`w-12 h-12 ${info.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <info.icon className={`w-6 h-6 ${info.iconColor}`} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{info.title}</h4>
                  <p className="text-muted-foreground whitespace-pre-line">{info.content}</p>
                  {info.extra && <p className="text-destructive font-medium text-sm mt-1">{info.extra}</p>}
                  {info.action && (
                    info.action.href ? (
                      <a href={info.action.href} className="text-secondary hover:text-secondary/80 font-medium text-sm mt-1 inline-block">{info.action.label}</a>
                    ) : (
                      <button onClick={info.action.onClick} className="text-secondary hover:text-secondary/80 font-medium text-sm mt-1">{info.action.label}</button>
                    )
                  )}
                </div>
              </motion.div>
            ))}

            {/* Quick Actions */}
            <div className="bg-gradient-navy rounded-2xl p-6 text-primary-foreground">
              <h4 className="font-display font-bold text-lg mb-4">Quick Actions</h4>
              <div className="space-y-3">
                <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold group" onClick={() => window.open('https://wa.me/918171897209', '_blank')}>
                  WhatsApp Us Now
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" className="w-full border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" onClick={() => window.location.href = "tel:+918171897209"}>
                  Call Now
                </Button>
              </div>
            </div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="border-border/40 shadow-premium-lg">
              <CardHeader>
                <CardTitle className="font-display text-xl">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Full Name *</label>
                      <Input name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" required className="bg-background" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Phone Number *</label>
                      <Input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Your phone number" required className="bg-background" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                    <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" className="bg-background" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Message *</label>
                    <Textarea name="message" value={formData.message} onChange={handleChange} placeholder="Tell us about your cleaning needs..." rows={4} required className="bg-background" />
                  </div>
                  <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-6 group">
                    Send Message via WhatsApp
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
