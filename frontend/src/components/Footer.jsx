import React from 'react';
import { FaClock } from 'react-icons/fa';


const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="mb-8 md:mb-0">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <FaClock className="text-white text-2xl" />
            </div>
            <span className="ml-3 text-xl font-bold">QueueWise Pro</span>
          </div>
          <p className="mt-4 max-w-xs text-gray-400">
            Advanced AI-powered queue management to transform customer experiences.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold mb-4 text-lg">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Use Cases</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 text-lg">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4 text-lg">Connect</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-400 text-sm">© 2025 QueueWise Pro. All rights reserved.</p>
        <div className="mt-4 md:mt-0 flex space-x-6">
          <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
  )
}

export default Footer