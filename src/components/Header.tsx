
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Phone, User, Menu, X } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavClick = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

 const handleBookNow = () => {
  const message = "Hi! I would like to schedule a pickup for my drycleaning service.";
  const whatsappUrl = `https://wa.me/918171647906?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
};

  const handleAuthAction = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
              <img 
                src="/lovable-uploads/c38313f8-3060-4373-8bf7-4b20c9a6b26d.png" 
                alt="Good Luck Drycleaners Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-gray-900">Good Luck</h1>
              <p className="text-xs md:text-sm text-blue-600">Drycleaners</p>
              <p className="text-[10px] md:text-xs text-gray-500">(Since 1970)</p>

            </div>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-8">
              <button onClick={() => handleNavClick('home')} className="text-gray-700 hover:text-blue-600 transition-colors">Home</button>
              <button onClick={() => handleNavClick('services')} className="text-gray-700 hover:text-blue-600 transition-colors">Services</button>
              <button onClick={() => handleNavClick('price-plans')} className="text-gray-700 hover:text-blue-600 transition-colors">Pricing</button>
              <button onClick={() => handleNavClick('about')} className="text-gray-700 hover:text-blue-600 transition-colors">About</button>
              <button onClick={() => handleNavClick('contact')} className="text-gray-700 hover:text-blue-600 transition-colors">Contact</button>
            </nav>
          )}

          {/* Desktop CTA Buttons */}
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-4">
              <a href="tel:+918171647906" className="flex items-center text-blue-600 hover:text-blue-800">
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </a>
              <Button variant="outline" size="sm" onClick={handleAuthAction}>
                <User className="w-4 h-4 mr-2" />
                {user ? 'Dashboard' : 'Login'}
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={handleBookNow}>
                Book Now
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <button onClick={toggleMenu} className="md:hidden">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobile && isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t">
            <nav className="flex flex-col space-y-4 mt-4">
              <button onClick={() => handleNavClick('home')} className="text-gray-700 hover:text-blue-600 transition-colors text-left">Home</button>
              <button onClick={() => handleNavClick('services')} className="text-gray-700 hover:text-blue-600 transition-colors text-left">Services</button>
              <button onClick={() => handleNavClick('price-plans')} className="text-gray-700 hover:text-blue-600 transition-colors text-left">Pricing</button>
              <button onClick={() => handleNavClick('about')} className="text-gray-700 hover:text-blue-600 transition-colors text-left">About</button>
              <button onClick={() => handleNavClick('contact')} className="text-gray-700 hover:text-blue-600 transition-colors text-left">Contact</button>
              <div className="flex flex-col space-y-2 pt-4 border-t">
                <Button variant="outline" size="sm" onClick={handleAuthAction}>
                  <User className="w-4 h-4 mr-2" />
                  {user ? 'Dashboard' : 'Login'}
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={handleBookNow}>
                  Book Now
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
