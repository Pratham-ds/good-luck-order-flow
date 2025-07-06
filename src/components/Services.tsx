
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Services = () => {
  const services = [
    {
      title: "Dry Cleaning",
      description: "Professional dry cleaning for delicate fabrics and formal wear",
      price: "From $8",
      features: ["Suits & Dresses", "Delicate Fabrics", "Stain Removal", "Press & Finish"],
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=200&fit=crop"
    },
    {
      title: "Wash & Fold",
      description: "Complete washing, drying, and folding service for everyday clothes",
      price: "From $2.50/lb",
      features: ["Washing & Drying", "Folding", "Fabric Softener", "Same Day Service"],
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=200&fit=crop"
    },
    {
      title: "Ironing & Pressing",
      description: "Professional pressing for crisp, wrinkle-free clothing",
      price: "From $3",
      features: ["Professional Press", "Starch Options", "Hanger Service", "Quick Turnaround"],
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop"
    },
    {
      title: "Alterations",
      description: "Expert tailoring and alterations for the perfect fit",
      price: "From $15",
      features: ["Hemming", "Taking In/Out", "Zipper Repair", "Custom Fitting"],
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=300&h=200&fit=crop"
    },
    {
      title: "Comforters & Bedding",
      description: "Large item cleaning for comforters, blankets, and bedding",
      price: "From $25",
      features: ["Comforters", "Blankets", "Pillows", "Curtains"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop"
    },
    {
      title: "Wedding Dress Care",
      description: "Specialized cleaning and preservation for wedding dresses",
      price: "From $150",
      features: ["Cleaning", "Preservation", "Storage Box", "Stain Treatment"],
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=300&h=200&fit=crop"
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional cleaning services tailored to meet all your laundry and dry cleaning needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative overflow-hidden rounded-t-lg">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full font-semibold">
                  {service.price}
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">{service.title}</CardTitle>
                <p className="text-gray-600">{service.description}</p>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Book This Service
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
