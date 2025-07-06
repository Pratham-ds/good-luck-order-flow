
import React from 'react';
import { Users, Award, Clock, MapPin } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Users, number: "10,000+", label: "Happy Customers" },
    { icon: Award, number: "14+", label: "Years Experience" },
    { icon: Clock, number: "48hr", label: "Turnaround Time" },
    { icon: MapPin, number: "5+", label: "Pickup Locations" }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose Good Luck Drycleaners?
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Since 2010, we've been providing exceptional laundry and dry cleaning services 
                to our community. Our commitment to quality, convenience, and customer satisfaction 
                has made us the trusted choice for thousands of families and businesses.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Premium Quality</h3>
                  <p className="text-gray-600">
                    We use only the finest cleaning products and state-of-the-art equipment 
                    to ensure your garments receive the best care possible.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Fast & Reliable</h3>
                  <p className="text-gray-600">
                    With our efficient processes and dedicated team, we guarantee 
                    quick turnaround times without compromising on quality.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Convenient Service</h3>
                  <p className="text-gray-600">
                    Free pickup and delivery service makes it easy to get professional 
                    cleaning without leaving your home or office.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&h=300&fit=crop" 
                alt="Our team" 
                className="w-full h-64 object-cover rounded-xl mb-6"
              />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Our Promise</h3>
              <p className="text-gray-600">
                Every garment is treated with care and attention to detail. 
                If you're not completely satisfied, we'll make it right.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
