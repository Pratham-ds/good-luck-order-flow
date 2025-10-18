
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dryCleaningIcon from "@/assets/dry-cleaning-icon.png";
import laundryIcon from "@/assets/laundry-icon.png";
import minorRepairIcon from "@/assets/minor-repair-icon.png";
import shoeCleaningIcon from "@/assets/shoe-cleaning-icon.png";
import curtainCleaningIcon from "@/assets/curtain-cleaning-icon.png";
import sofaCleaningIcon from "@/assets/sofa-cleaning-icon.png";

const Services = () => {
  const regularServices = [
    {
      title: "Dry Cleaning",
      description: "Professional dry cleaning for delicate fabrics and formal wear",
      price: "From ₹80",
      features: ["Suits & Dresses", "Delicate Fabrics", "Stain Removal", "Press & Finish"],
      image: dryCleaningIcon
    },
    {
      title: "Wash & Fold",
      description: "Complete washing, drying, and folding service for everyday clothes",
      price: "From ₹50/kg",
      features: ["Washing & Drying", "Folding", "Fabric Softener", "Same Day Service"],
      image: laundryIcon
    },
    {
      title: "Ironing & Pressing",
      description: "Professional pressing for crisp, wrinkle-free clothing",
      price: "From ₹30",
      features: ["Professional Press", "Starch Options", "Hanger Service", "Quick Turnaround"],
      image: laundryIcon
    },
    {
      title: "Minor Repair",
      description: "Expert minor repairs and tailoring for the perfect fit",
      price: "From ₹150",
      features: ["Hemming", "Taking In/Out", "Zipper Repair", "Custom Fitting"],
      image: minorRepairIcon
    },
    {
      title: "Comforters & Bedding",
      description: "Large item cleaning for comforters, blankets, and bedding",
      price: "From ₹250",
      features: ["Comforters", "Blankets", "Pillows", "Curtains"],
      image: laundryIcon
    },
    {
      title: "Wedding Dress Care",
      description: "Specialized cleaning and preservation for wedding dresses",
      price: "From ₹1500",
      features: ["Cleaning", "Preservation", "Storage Box", "Stain Treatment"],
      image: dryCleaningIcon
    }
  ];

  const specializedServices = [
    {
      title: "Shoe & Boot Cleaning",
      description: "Professional cleaning for all types of footwear",
      price: "From ₹100",
      features: ["Sports Shoes", "Leather Boots", "Branded Footwear", "Deep Cleaning"],
      image: shoeCleaningIcon,
      icon: "👟"
    },
    {
      title: "Carpet Cleaning",
      description: "Deep cleaning and stain removal for all carpet types",
      price: "From ₹200/sqm",
      features: ["Deep Steam Cleaning", "Stain Removal", "Odor Treatment", "Quick Drying"],
      image: laundryIcon,
      icon: "🧽"
    },
    {
      title: "Curtain Cleaning",
      description: "Gentle cleaning for all types of curtains and drapes",
      price: "From ₹150/panel",
      features: ["Delicate Fabric Care", "Colour Protection", "Wrinkle-Free", "UV Protection"],
      image: curtainCleaningIcon,
      icon: "🪟"
    },
    {
      title: "Sofa Cleaning",
      description: "Professional upholstery cleaning for sofas and furniture",
      price: "From ₹800",
      features: ["Fabric & Leather", "Deep Sanitization", "Stain Removal", "Odor Elimination"],
      image: sofaCleaningIcon,
      icon: "🛋️"
    },
    {
      title: "Mat Cleaning",
      description: "Thorough cleaning for doormats, bath mats, and floor mats",
      price: "From ₹80",
      features: ["All Mat Types", "Antibacterial Treatment", "Quick Drying", "Odor Removal"],
      image: laundryIcon,
      icon: "🏠"
    },
    {
      title: "Household Fabric Items",
      description: "Cleaning service for various household fabric items",
      price: "From ₹50",
      features: ["Table Covers", "Cushion Covers", "Blankets", "Custom Items"],
      image: laundryIcon,
      icon: "🏡"
    }
  ];

 const handleBookService = (serviceName: string) => {
  const phoneNumber = "918171897209"; // WhatsApp number (without +)
  const message = `Hello Good Luck Drycleaners! I would like to book your "${serviceName}" service. Please provide details.`;
  const encodedMessage = encodeURIComponent(message);

  window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
};

  const ServiceCard = ({ service, showIcon = false }: { service: any, showIcon?: boolean }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative overflow-hidden rounded-t-lg">
        <img 
          src={service.image} 
          alt={service.title}
          className="w-full h-48 object-contain bg-blue-50 p-4 group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full font-semibold">
          {service.price}
        </div>
        {showIcon && (
          <div className="absolute top-4 left-4 text-2xl bg-white rounded-full w-10 h-10 flex items-center justify-center">
            {service.icon}
          </div>
        )}
      </div>
      
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">{service.title}</CardTitle>
        <p className="text-gray-600">{service.description}</p>
      </CardHeader>
      
      <CardContent>
        <ul className="space-y-2 mb-6">
          {service.features.map((feature: string, featureIndex: number) => (
            <li key={featureIndex} className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
              {feature}
            </li>
          ))}
        </ul>
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={() => handleBookService(service.title)}
        >
          Book This Service
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive cleaning services for clothes, footwear, and household items with 99% stain removal guarantee
          </p>
        </div>

        <Tabs defaultValue="regular" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-12">
            <TabsTrigger value="regular" className="text-lg">Regular Services</TabsTrigger>
            <TabsTrigger value="specialized" className="text-lg">Specialized Cleaning</TabsTrigger>
          </TabsList>
          
          <TabsContent value="regular">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularServices.map((service, index) => (
                <ServiceCard key={index} service={service} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="specialized">
            <div className="mb-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Specialized Cleaning Services</h3>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Beyond regular laundry, we offer professional cleaning for shoes, carpets, sofas, and other household items. Each service is tailored to the specific material and cleaning requirements.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {specializedServices.map((service, index) => (
                <ServiceCard key={index} service={service} showIcon={true} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Services;
