import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, MapPin } from 'lucide-react';
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
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

  return (
    <section id="home" className="bg-gradient-to-br from-blue-50 to-blue-100 py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Professional
                <span className="text-blue-600 block">Dry Cleaning</span>
                <span className="text-gray-700">& Laundry</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Experience premium laundry and dry cleaning services with free pickup & delivery. 
                Your clothes deserve the best care.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6"
                onClick={handleBookPickup}
              >
                Book Pickup Now
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={handleViewServices}
              >
                View Services
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">99% Stain Removal</p>
                  <p className="text-sm text-gray-600">Guaranteed</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-900">48hr Service</p>
                  <p className="text-sm text-gray-600">Fast turnaround</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-900">Free Pickup</p>
                  <p className="text-sm text-gray-600">& delivery</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-300">
              <img 
                src={heroImage} 
                alt="Professional dry cleaning services with modern equipment and clean clothes" 
                className="rounded-xl w-full h-80 object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-blue-600 text-white p-4 rounded-xl shadow-lg">
              <p className="font-bold text-lg">Since 1970</p>
              <p className="text-sm">Trusted by 50,000+ customers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
