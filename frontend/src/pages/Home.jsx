import React, { useState, useEffect } from 'react';
import { FaClock, FaCalendarAlt, FaExclamationTriangle, FaChartLine, FaUserFriends, FaMobileAlt, FaBuilding } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    features: false,
    benefits: false,
    cta: false
  });

  useEffect(() => {
    // Stagger animations on load
    const timer = setTimeout(() => {
      setIsVisible({
        hero: true,
        features: false,
        benefits: false,
        cta: false
      });
    }, 200);

    const timer2 = setTimeout(() => {
      setIsVisible(prev => ({ ...prev, features: true }));
    }, 700);

    const timer3 = setTimeout(() => {
      setIsVisible(prev => ({ ...prev, benefits: true }));
    }, 1200);

    const timer4 = setTimeout(() => {
      setIsVisible(prev => ({ ...prev, cta: true }));
    }, 1700);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  const fadeInClass = (element) => {
    return isVisible[element] 
      ? 'opacity-100 translate-y-0' 
      : 'opacity-0 translate-y-8';
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Navigation */}
  

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6">
        <div className={`container mx-auto transition-all duration-1000 ease-out transform ${fadeInClass('hero')}`}>
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">AI-Powered</span> Smart Queue Management
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                End frustrating long wait times and inefficiencies with our advanced AI queue management system. Get accurate predictions, personalized recommendations, and real-time updates.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center">
                  Request Demo <FiArrowRight className="ml-2" />
                </button>
                <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
            <div className="md:w-1/2 pl-0 md:pl-12">
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-6 shadow-lg">
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-lg">DMV Service Center</h3>
                      <span className="text-green-600 text-sm font-medium">Open Now</span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <FaClock className="text-blue-600" />
                          </div>
                          <span className="ml-3 text-gray-700">Current Wait</span>
                        </div>
                        <span className="font-bold">24 minutes</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div className="flex items-center">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <FaCalendarAlt className="text-green-600" />
                          </div>
                          <span className="ml-3 text-gray-700">Recommended Time</span>
                        </div>
                        <span className="font-bold text-green-600">2:15 PM</span>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center">
                          <div className="bg-indigo-100 p-2 rounded-lg">
                            <FaUserFriends className="text-indigo-600" />
                          </div>
                          <span className="ml-3 text-gray-700">People Ahead</span>
                        </div>
                        <span className="font-bold">7</span>
                      </div>
                    </div>
                    <button className="w-full bg-blue-600 text-white mt-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      Reserve Your Spot
                    </button>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-white font-bold">AI Powered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className={`container mx-auto px-6 transition-all duration-1000 ease-out transform ${fadeInClass('features')}`}>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Advanced AI Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our cutting-edge technology uses machine learning to make queue management smarter and more efficient.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-blue-100 p-4 rounded-lg inline-block mb-4">
                <FaClock className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Wait Time Prediction</h3>
              <p className="text-gray-600">
                AI algorithms accurately predict wait times based on historical data, current conditions, and real-time queue behavior.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-green-100 p-4 rounded-lg inline-block mb-4">
                <FaCalendarAlt className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Time Slot Recommendation</h3>
              <p className="text-gray-600">
                Get personalized recommendations for the best time to visit based on your preferences and current queue data.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-red-100 p-4 rounded-lg inline-block mb-4">
                <FaExclamationTriangle className="text-red-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Anomaly Detection</h3>
              <p className="text-gray-600">
                Instantly identify unusual patterns or issues in queue flow, alerting staff to potential problems before they escalate.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-indigo-100 p-4 rounded-lg inline-block mb-4">
                <FaChartLine className="text-indigo-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Real-Time Adaptation</h3>
              <p className="text-gray-600">
                Our system continuously updates and adapts to changes in foot traffic, staffing levels, and other dynamic factors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20">
        <div className={`container mx-auto px-6 transition-all duration-1000 ease-out transform ${fadeInClass('benefits')}`}>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Transforming Queue Experiences</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              QueueWise Pro benefits both visitors and facility managers with innovative solutions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="bg-blue-100 p-4 rounded-full h-16 w-16 flex items-center justify-center flex-shrink-0">
                <FaUserFriends className="text-blue-600 text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">For Visitors</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Reduced uncertainty and frustration with accurate wait times
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Mobile notifications and updates on queue status
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Personalized time slot recommendations
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Virtual queuing options to avoid physical waiting
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="bg-indigo-100 p-4 rounded-full h-16 w-16 flex items-center justify-center flex-shrink-0">
                <FaBuilding className="text-indigo-600 text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">For Facilities</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Optimized staff allocation and resource management
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Real-time analytics and performance insights
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Proactive issue detection and resolution
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Multi-center coordination and optimization
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Transform Any Queue Experience</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              QueueWise Pro works in any environment where people wait in line.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-all">
              <div className="bg-blue-50 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <h3 className="font-bold mb-2">Government Services</h3>
              <p className="text-gray-600 text-sm">DMV, passport offices, tax centers</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-all">
              <div className="bg-green-50 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
              </div>
              <h3 className="font-bold mb-2">Retail</h3>
              <p className="text-gray-600 text-sm">Black Friday, store debuts, customer service</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-all">
              <div className="bg-red-50 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="font-bold mb-2">Healthcare</h3>
              <p className="text-gray-600 text-sm">Hospitals, clinics, vaccination centers</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-all">
              <div className="bg-indigo-50 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="font-bold mb-2">Entertainment</h3>
              <p className="text-gray-600 text-sm">Theme parks, concerts, sporting events</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className={`container mx-auto px-6 transition-all duration-1000 ease-out transform ${fadeInClass('cta')}`}>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Queue Experience?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join the organizations that have reduced wait times by up to 70% and improved customer satisfaction.
            </p>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-lg">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="px-4 py-3 rounded-lg bg-white text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-blue-300" 
                />
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors whitespace-nowrap">
                  Request Demo
                </button>
              </div>
              <p className="text-sm mt-4 opacity-80">
                Get a personalized demo and see how QueueWise Pro can work for your organization.
              </p>
            </div>
            
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold">70%</div>
                <div className="opacity-80">Wait Time Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">93%</div>
                <div className="opacity-80">Customer Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">45%</div>
                <div className="opacity-80">Staff Efficiency Gain</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">250+</div>
                <div className="opacity-80">Happy Clients</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      
      
      {/* Floating Contact Button */}
      <div className="fixed bottom-6 right-6 z-10">
        <button className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
          <FaMobileAlt className="text-xl" />
        </button>
      </div>
    </div>
  );
}