import React from 'react';
import Layout from '../components/Layout';
import { FaCar, FaUsers, FaAward, FaHandshake, FaGlobe, FaCog } from 'react-icons/fa';

const AboutUs = () => {
  const stats = [
    { number: '10,000+', label: 'Happy Customers', icon: FaUsers },
    { number: '50,000+', label: 'Cars Sold', icon: FaCar },
    { number: '15+', label: 'Years Experience', icon: FaAward },
    { number: '100+', label: 'Cities Covered', icon: FaGlobe }
  ];

  const values = [
    {
      icon: FaHandshake,
      title: 'Trust & Reliability',
      description: 'We have built our reputation on trust and reliability, ensuring every customer gets the best service.'
    },
    {
      icon: FaCog,
      title: 'Quality Assurance',
      description: 'Every vehicle undergoes rigorous quality checks to ensure you get the best value for your money.'
    },
    {
      icon: FaUsers,
      title: 'Customer First',
      description: 'Our customers are at the heart of everything we do, and we strive to exceed their expectations.'
    }
  ];

  return (
    <Layout>
      <div className="bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About CrazyCars</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Your trusted partner in finding the perfect vehicle for your needs. 
              We've been serving customers for over 15 years with dedication and excellence.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <stat.icon className="text-blue-600 dark:text-blue-400 text-3xl mx-auto mb-4" />
                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Our Story Section */}
        <div className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">
                Our Story
              </h2>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
                    Founded on a Dream
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    CrazyCars was founded in 2008 with a simple vision: to make car buying 
                    easy, transparent, and enjoyable for everyone. What started as a small 
                    dealership has grown into one of the most trusted names in the automotive industry.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Our journey has been marked by continuous innovation, customer satisfaction, 
                    and a commitment to providing the best vehicles at competitive prices.
                  </p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 text-center">
                  <FaCar className="text-6xl text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 italic">
                    "Every car tells a story, and we help you find yours."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">
              Our Values
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-center">
                  <value.icon className="text-blue-600 dark:text-blue-400 text-4xl mx-auto mb-6" />
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
                Our Mission
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                To revolutionize the car buying experience by providing exceptional service, 
                transparent pricing, and a wide selection of quality vehicles that meet every 
                customer's unique needs and budget.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-lg">
                <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Why Choose CrazyCars?
                </h3>
                <ul className="text-left text-gray-600 dark:text-gray-400 space-y-3">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    Comprehensive vehicle inspection and certification
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    Competitive pricing with no hidden fees
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    Expert customer service and support
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    Flexible financing options
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    Nationwide warranty and service network
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Find Your Perfect Car?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have found their dream vehicle with us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/" 
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Browse Cars
              </a>
              <a 
                href="/contact" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutUs;

