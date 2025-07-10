
import React from 'react';
import { CheckCircle, Users, Award, Clock } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            About Good Luck Drycleaners
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A legacy of excellence in garment care, serving our community with dedication and quality since 1970.
          </p>
        </div>

        {/* Historical Heritage Section */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Rich Heritage</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  For over five decades, Good Luck Drycleaners has been a cornerstone of quality garment care in our community. 
                  What started as a small family business has grown into a trusted name, while maintaining the same commitment 
                  to excellence that our founders established.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  This vintage photograph shows where it all began - our original shop with the dedicated craftsmen who 
                  built the foundation of trust and quality that continues today. Their legacy lives on in every garment we care for.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">
                  Since 1970
                </div>
                <div className="text-gray-600">
                  <span className="font-semibold">50+ Years</span> of Excellence
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white p-4 rounded-2xl shadow-lg">
                <img 
                  src="/lovable-uploads/29c8ae48-7d47-4251-bf27-f0467567569e.png" 
                  alt="Historical photo of Good Luck Drycleaners from the early days showing our founders" 
                  className="rounded-xl w-full h-80 object-cover grayscale hover:grayscale-0 transition-all duration-300"
                />
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500 italic">
                    Our founders at the original Good Luck Drycleaners shop - where our journey began
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-gray-900 p-3 rounded-xl shadow-lg">
                <Award className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Guaranteed</h3>
            <p className="text-gray-600">99% stain removal success rate with our advanced cleaning techniques.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Trusted by Thousands</h3>
            <p className="text-gray-600">Over 50,000 satisfied customers trust us with their precious garments.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Award Winning</h3>
            <p className="text-gray-600">Recognized for excellence in garment care and customer service.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Service</h3>
            <p className="text-gray-600">48-hour turnaround time with free pickup and delivery service.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                To provide exceptional garment care services that exceed our customers' expectations, 
                while maintaining the traditional values of quality, integrity, and personal service 
                that has been our hallmark for over five decades.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Eco-friendly cleaning processes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">State-of-the-art equipment</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Experienced and trained staff</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Convenient pickup & delivery</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop" 
                alt="Modern dry cleaning facility" 
                className="rounded-xl w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-blue-600 bg-opacity-10 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
