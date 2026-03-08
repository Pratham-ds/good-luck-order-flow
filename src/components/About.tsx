import React from 'react';
import { CheckCircle, Users, Award, Clock } from 'lucide-react';
import { motion } from "framer-motion";
import missionImage from "@/assets/mission-laundry.png";

const About = () => {
  const highlights = [
    { icon: CheckCircle, title: 'Quality Guaranteed', desc: '99% stain removal success rate with our advanced cleaning techniques.', bg: 'bg-secondary/10', iconColor: 'text-secondary' },
    { icon: Users, title: 'Trusted by Thousands', desc: 'Over 50,000 satisfied customers trust us with their precious garments.', bg: 'bg-primary/5', iconColor: 'text-primary' },
    { icon: Award, title: 'Award Winning', desc: 'Recognized for excellence in garment care and customer service.', bg: 'bg-secondary/10', iconColor: 'text-secondary' },
    { icon: Clock, title: 'Fast Service', desc: '48-hour turnaround time with free pickup and delivery service.', bg: 'bg-primary/5', iconColor: 'text-primary' },
  ];

  return (
    <section id="about" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-secondary font-semibold text-sm uppercase tracking-widest mb-3">Our Story</p>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            About Good Luck Drycleaners
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            A legacy of excellence in garment care, serving our community with dedication and quality since 1970.
          </p>
        </motion.div>

        {/* Heritage Section */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground">Our Rich Heritage</h3>
              <p className="text-muted-foreground leading-relaxed">
                For over five decades, Good Luck Drycleaners has been a cornerstone of quality garment care in our community. 
                What started as a small family business has grown into a trusted name, while maintaining the same commitment 
                to excellence that our founders established.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This vintage photograph shows where it all began — our original shop with the dedicated craftsmen who 
                built the foundation of trust and quality that continues today.
              </p>
              <div className="flex items-center gap-4">
                <div className="bg-gradient-gold text-secondary-foreground px-5 py-2.5 rounded-xl font-display font-bold">
                  Since 1970
                </div>
                <span className="text-muted-foreground">
                  <span className="font-semibold text-foreground">50+ Years</span> of Excellence
                </span>
              </div>
            </div>
            <div className="relative">
              <div className="bg-card p-3 rounded-2xl shadow-premium-lg border border-border/50">
                <img 
                  src="/lovable-uploads/29c8ae48-7d47-4251-bf27-f0467567569e.png" 
                  alt="Historical photo of Good Luck Drycleaners from the early days showing our founders" 
                  className="rounded-xl w-full h-80 object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
                <p className="mt-3 text-center text-sm text-muted-foreground italic px-4">
                  Our founders at the original Good Luck Drycleaners shop
                </p>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-secondary text-secondary-foreground p-3 rounded-xl shadow-lg">
                <Award className="w-6 h-6" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {highlights.map((item, i) => (
            <motion.div 
              key={i}
              className="text-center p-8 bg-card rounded-2xl shadow-premium border border-border/40 hover:shadow-premium-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={`${item.bg} w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <item.icon className={`w-7 h-7 ${item.iconColor}`} />
              </div>
              <h3 className="text-lg font-display font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Mission */}
        <motion.div 
          className="bg-card rounded-3xl p-8 md:p-12 shadow-premium-lg border border-border/40"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-secondary font-semibold text-sm uppercase tracking-widest mb-3">Our Purpose</p>
              <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                To provide exceptional garment care services that exceed our customers' expectations, 
                while maintaining the traditional values of quality, integrity, and personal service 
                that has been our hallmark for over five decades.
              </p>
              <div className="space-y-3">
                {['Eco-friendly cleaning processes', 'State-of-the-art equipment', 'Experienced and trained staff', 'Convenient pickup & delivery'].map((text, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span className="text-muted-foreground">{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img 
                src={missionImage} 
                alt="Professional laundry and dry cleaning facility with washing machines and folded clothes" 
                className="rounded-2xl w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-primary/5 rounded-2xl"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
