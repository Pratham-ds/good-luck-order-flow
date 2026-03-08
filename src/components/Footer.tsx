
import React from 'react';
import { Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-navy text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-gold rounded-xl flex items-center justify-center">
                <span className="text-secondary-foreground font-display font-bold text-lg">GL</span>
              </div>
              <div>
                <h2 className="text-xl font-display font-bold">Good Luck</h2>
                <p className="text-sm text-secondary">Drycleaners</p>
              </div>
            </div>
            <p className="text-primary-foreground/60 text-sm leading-relaxed">
              Premium laundry and dry cleaning services with free pickup & delivery. 
              Your clothes deserve the best care with 99% stain removal guarantee.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-base font-display font-semibold mb-5">Our Services</h3>
            <ul className="space-y-2.5">
              {['Dry Cleaning', 'Wash & Fold', 'Shoe Cleaning', 'Carpet Cleaning', 'Sofa Cleaning'].map((s) => (
                <li key={s}><a href="#services" className="text-primary-foreground/50 hover:text-secondary transition-colors text-sm">{s}</a></li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-base font-display font-semibold mb-5">Quick Links</h3>
            <ul className="space-y-2.5">
              {[['Home', '#home'], ['About Us', '#about'], ['Services', '#services'], ['Contact', '#contact']].map(([label, href]) => (
                <li key={label}><a href={href} className="text-primary-foreground/50 hover:text-secondary transition-colors text-sm">{label}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-display font-semibold mb-5">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-secondary" />
                <span className="text-primary-foreground/60 text-sm">+91 8171647906</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-secondary mt-0.5" />
                <div className="text-primary-foreground/60 text-sm">
                  <p>Ambar Road, Malviya Marg</p>
                  <p>near Barh Ka Ped, Bulandshahr</p>
                </div>
              </div>
              <div className="text-primary-foreground/60 text-sm">
                <p>Tuesday - Sunday: 10 AM - 9 PM</p>
                <p className="text-destructive text-xs mt-0.5">Closed on Monday</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/40 text-sm">
              © 2024 Good Luck Drycleaners. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map((link) => (
                <a key={link} href="#" className="text-primary-foreground/40 hover:text-secondary text-sm transition-colors">{link}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
