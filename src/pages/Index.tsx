
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import SpecialOffers from '@/components/SpecialOffers';
import PricePlans from '@/components/PricePlans';
import Testimonials from '@/components/Testimonials';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <SpecialOffers />
      <PricePlans />
      <Testimonials />
      <About />
      <Contact />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
