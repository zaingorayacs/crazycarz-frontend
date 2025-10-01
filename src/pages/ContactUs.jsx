import React, { useState } from 'react';
import Layout from '../components/Layout';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setFormStatus('submitting');
    
    // Mock API call
    setTimeout(() => {
      setFormStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  return (
    <Layout>
      <div className="bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100">Contact Us</h1>
          
          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-full mb-4">
                <FaMapMarkerAlt className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Our Location</h3>
              <p className="text-gray-600 dark:text-gray-400">123 Car Street, Auto City, AC 12345</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="bg-green-50 dark:bg-green-900 p-3 rounded-full mb-4">
                <FaPhone className="text-green-600 dark:text-green-400 text-xl" />
              </div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Phone Number</h3>
              <p className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
              <p className="text-gray-600 dark:text-gray-400">+1 (555) 765-4321</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="bg-red-50 dark:bg-red-900 p-3 rounded-full mb-4">
                <FaEnvelope className="text-red-600 dark:text-red-400 text-xl" />
              </div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Email Address</h3>
              <p className="text-gray-600 dark:text-gray-400">info@crazycars.com</p>
              <p className="text-gray-600 dark:text-gray-400">support@crazycars.com</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="bg-purple-50 dark:bg-purple-900 p-3 rounded-full mb-4">
                <FaClock className="text-purple-600 dark:text-purple-400 text-xl" />
              </div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Working Hours</h3>
              <p className="text-gray-600 dark:text-gray-400">Mon - Fri: 9:00 AM - 6:00 PM</p>
              <p className="text-gray-600 dark:text-gray-400">Sat: 10:00 AM - 4:00 PM</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Send Us a Message</h2>
              
              {formStatus === 'success' && (
                <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-3 rounded mb-6">
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors w-full"
                >
                  {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
            
            {/* Map */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Our Location</h2>
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
                {/* Placeholder for map - in a real app, you'd use Google Maps or similar */}
                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-600">
                  <p className="text-gray-500 dark:text-gray-400">Map Placeholder</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Crazy Cars Headquarters</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-1">123 Car Street, Auto City, AC 12345</p>
                <p className="text-gray-600 dark:text-gray-400 mb-1">United States</p>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Email:</strong> info@crazycars.com | <strong>Phone:</strong> +1 (555) 123-4567
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactUs;