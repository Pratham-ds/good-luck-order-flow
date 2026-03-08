
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Phone, User, Menu, X } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavClick = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const handleBookNow = () => {
    const message = "Hi! I would like to schedule a pickup for my drycleaning service.";
    const whatsappUrl = `https://wa.me/918171897209?text=${encodeURIComponent(message)}`;
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
    <header className={`sticky top-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-card/95 backdrop-blur-xl shadow-premium border-b border-border' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => handleNavClick('home')}>
            <div className="w-11 h-11 md:w-13 md:h-13 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <img 
                src="/lovable-uploads/c38313f8-3060-4373-8bf7-4b20c9a6b26d.png" 
                alt="Good Luck Drycleaners Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="leading-tight">
              <h1 className="text-xl md:text-2xl font-display font-bold text-foreground tracking-tight">
                Good Luck
              </h1>
              <div className="flex items-center gap-2">
                <div className="w-8 h-[2px] bg-secondary rounded-full"></div>
                <p className="text-sm text-muted-foreground font-medium tracking-wide uppercase">
                  Drycleaners
                </p>
              </div>
              <p className="text-[10px] text-muted-foreground italic">Est. 1970</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-1">
              {['home', 'services', 'price-plans', 'about', 'contact'].map((section) => (
                <button 
                  key={section}
                  onClick={() => handleNavClick(section)} 
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/60 transition-all duration-200 capitalize"
                >
                  {section === 'price-plans' ? 'Pricing' : section}
                </button>
              ))}
            </nav>
          )}

          {/* Desktop CTA */}
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-3">
              <a href="tel:+918171897209" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted/60">
                <Phone className="w-4 h-4 mr-2" />
                Call
              </a>
              <Button variant="outline" size="sm" onClick={handleAuthAction} className="border-border hover:bg-muted/60 font-medium">
                <User className="w-4 h-4 mr-2" />
                {user ? 'Dashboard' : 'Login'}
              </Button>
              <Button size="sm" onClick={handleBookNow} className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold shadow-sm">
                Book Now
              </Button>
            </div>
          )}

          {/* Mobile */}
          {isMobile && (
            <button onClick={toggleMenu} className="p-2 rounded-lg hover:bg-muted/60 transition-colors">
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobile && isMenuOpen && (
          <div className="mt-4 pb-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col space-y-1 mt-4">
              {['home', 'services', 'price-plans', 'about', 'contact'].map((section) => (
                <button 
                  key={section}
                  onClick={() => handleNavClick(section)} 
                  className="text-left px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-lg transition-colors capitalize font-medium"
                >
                  {section === 'price-plans' ? 'Pricing' : section}
                </button>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                <Button variant="outline" size="sm" onClick={handleAuthAction} className="justify-start">
                  <User className="w-4 h-4 mr-2" />
                  {user ? 'Dashboard' : 'Login'}
                </Button>
                <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold" onClick={handleBookNow}>
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
