import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Shirt, Crown, Home, HeartHandshake } from 'lucide-react';

const PricePlans = () => {
  const menWear = [
    { item: "Shirt/T-shirt", regular: "100/P", offer: "80/P" },
    { item: "Jacket", regular: "320/P", offer: "200/P" },
    { item: "Coat", regular: "300/P", offer: "200/P" },
    { item: "Suit 2 P", regular: "300", offer: "220" },
    { item: "Suit 3 P", regular: "370", offer: "310" },
    { item: "Jeans/Trousers", regular: "105", offer: "85" },
    { item: "Kurta/Pajama", regular: "200", offer: "140" }
  ];

  const womenWear = [
    { item: "Saree", regular: "220", offer: "140+" },
    { item: "Salwar", regular: "170", offer: "120" },
    { item: "Lengha", regular: "420+", offer: "270+" },
    { item: "Shawl", regular: "170", offer: "100" },
    { item: "Kurta", regular: "200", offer: "120" },
    { item: "Dress", regular: "120+", offer: "95" }
  ];

  const householdItems = [
    { item: "S blanket S/D Layer", regular: "220/270", offer: "170/220" },
    { item: "D blanket S/D Layer", regular: "370/520", offer: "280/320" },
    { item: "Bedsheet S/D", regular: "200/270", offer: "100/140" },
    { item: "Curtain (per panel)", regular: "170", offer: "100" },
    { item: "Pillow cover (per pair)", regular: "80/pair", offer: "60" }
  ];

  const shoesCleaning = [
    { item: "Sports", regular: "270", offer: "220" },
    { item: "Canvas", regular: "270", offer: "200" },
    { item: "Boots", regular: "520+", offer: "370+" }
  ];

  const PriceTable = ({ data, icon: Icon, title }: { data: any[], icon: any, title: string }) => (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-2 font-semibold">Item</th>
                <th className="text-center py-3 px-2 font-semibold">Regular Price (₹)</th>
                <th className="text-center py-3 px-2 font-semibold text-green-600">Offer Price (₹)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 font-medium">{row.item}</td>
                  <td className="py-3 px-2 text-center text-gray-600 line-through">{row.regular}</td>
                  <td className="py-3 px-2 text-center text-green-600 font-semibold">{row.offer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div id="price-plans" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Price Plans</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transparent pricing for every fabric and every home
          </p>
        </div>

        <Accordion type="single" collapsible defaultValue="men-wear" className="space-y-6">
          <AccordionItem value="men-wear" className="border-0">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shirt className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold">Men's Wear</h3>
                  <p className="text-gray-600">Professional dry cleaning for men's clothing</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <PriceTable data={menWear} icon={Shirt} title="Men's Wear Pricing" />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="women-wear" className="border-0">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-pink-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold">Women's Wear</h3>
                  <p className="text-gray-600">Delicate care for women's garments</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <PriceTable data={womenWear} icon={Crown} title="Women's Wear Pricing" />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="household" className="border-0">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Home className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold">Household Items</h3>
                  <p className="text-gray-600">Complete home textile care services</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <PriceTable data={householdItems} icon={Home} title="Household Items Pricing" />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="shoes" className="border-0">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <HeartHandshake className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold">👟 Shoe Cleaning</h3>
                  <p className="text-gray-600">Professional shoe cleaning and restoration</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <PriceTable data={shoesCleaning} icon={HeartHandshake} title="Shoe Cleaning Pricing" />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-12 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Special Offers Available!</h3>
            <p className="text-blue-700">
              Enjoy our discounted rates on all services. Prices may vary based on fabric type and condition.
              Contact us for bulk orders and additional discounts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricePlans;