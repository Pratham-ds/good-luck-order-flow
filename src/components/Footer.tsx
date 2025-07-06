
import React from 'react';
import { Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">GL</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Good Luck</h1>
                <p className="text-sm text-blue-400">Drycleaners</p>
              </div>
            </div>
            <p className="text-gray-400">
              Premium laundry and dry cleaning services with free pickup & delivery. 
              Your clothes deserve the best care.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Dry Cleaning</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Wash & Fold</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Shoe Cleaning</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Carpet Cleaning</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Sofa Cleaning</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Login</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400">+91 8171647906</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5" />
                <div className="text-gray-400">
                  <p>Ambar Road, Malviya Marg</p>
                  <p>near Barh Ka Ped</p>
                  <p>Bulandshahr</p>
                </div>
              </div>
              <div className="text-gray-400">
                <p>Open Daily: 10:00 AM - 9:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Good Luck Drycleaners. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Refund Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
