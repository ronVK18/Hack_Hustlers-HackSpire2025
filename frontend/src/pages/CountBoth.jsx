import React, { useState, useRef } from 'react';
import { 
  FaUsers, 
  FaUserTie, 
  FaUpload, 
  FaCamera, 
  FaEye, 
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function CountBoth() {
  const [queueImageUrl, setQueueImageUrl] = useState('');
  const [staffImageUrl, setStaffImageUrl] = useState('');
  const [queueCount, setQueueCount] = useState(null);
  const [staffCount, setStaffCount] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const queueInputRef = useRef(null);
  const staffInputRef = useRef(null);
  
  const detectPeople = async (imageUrl, section) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Make request to your backend
      const response = await fetch('http://localhost:5000/api/detect-people', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to detect people');
      }
      
      const data = await response.json();
      const peopleCount = data.peopleCount;
      
      // Update state based on section
      if (section === 'queue') {
        setQueueCount(peopleCount);
        setSuccessMessage(`Successfully detected ${peopleCount} people in the queue!`);
      } else {
        setStaffCount(peopleCount);
        setSuccessMessage(`Successfully detected ${peopleCount} staff members!`);
      }
    } catch (err) {
      setError(`Failed to detect people: ${err.message}`);
    } finally {
      setIsLoading(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  };
  
  const handleImageSubmit = (section) => {
    const imageUrl = section === 'queue' ? queueImageUrl : staffImageUrl;
    
    if (!imageUrl) {
      setError('Please enter an image URL first');
      return;
    }
    
    detectPeople(imageUrl, section);
  };
  
  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
    setError(null);
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Crowd Detection System</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Upload images to detect and count people in queues and staff areas
          </p>
        </header>
        
        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Queue Detection Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl overflow-hidden"
          >
            <div 
              className="bg-gradient-to-br from-blue-900/40 to-blue-700/20 backdrop-blur-lg border border-blue-800/50 rounded-xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold flex items-center">
                    <FaUsers className="text-blue-400 mr-3" />
                    Queue Detection
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleSection('queue')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <FaEye className="mr-2" />
                    {activeSection === 'queue' ? 'Close' : 'Detect'}
                  </motion.button>
                </div>
                
                <div className="bg-blue-900/30 p-4 rounded-lg mb-4 flex items-center">
                  <div className="bg-blue-500/20 p-3 rounded-full mr-4">
                    <FaUsers size={24} className="text-blue-300" />
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-300">Queue Count</h3>
                    <p className="text-3xl font-bold">
                      {queueCount !== null ? queueCount : '-'}
                    </p>
                  </div>
                </div>
                
                {activeSection === 'queue' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-800/50 rounded-lg p-4 mb-4"
                  >
                    <div className="flex flex-col md:flex-row gap-3">
                      <input
                        ref={queueInputRef}
                        type="text"
                        placeholder="Enter image URL"
                        value={queueImageUrl}
                        onChange={(e) => setQueueImageUrl(e.target.value)}
                        className="flex-1 bg-gray-700/70 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleImageSubmit('queue')}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaCamera className="mr-2" />}
                        {isLoading ? 'Processing...' : 'Analyze Image'}
                      </motion.button>
                    </div>
                    
                    {queueImageUrl && (
                      <div className="mt-4 bg-gray-800/70 rounded-lg p-2 border border-gray-700">
                        <p className="text-xs text-gray-400 mb-2">Preview:</p>
                        <img 
                          src={queueImageUrl} 
                          alt="Queue preview" 
                          className="w-full h-48 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/api/placeholder/400/300?text=Invalid+Image+URL";
                          }}
                        />
                      </div>
                    )}
                  </motion.div>
                )}
                
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((i) => (
                    <motion.div 
                      key={i}
                      className="bg-blue-900/20 h-24 rounded-lg flex items-center justify-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FaUsers className="text-blue-500/70" size={24} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Staff Detection Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-xl overflow-hidden"
          >
            <div 
              className="bg-gradient-to-br from-purple-900/40 to-purple-700/20 backdrop-blur-lg border border-purple-800/50 rounded-xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold flex items-center">
                    <FaUserTie className="text-purple-400 mr-3" />
                    Staff Detection
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleSection('staff')}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <FaEye className="mr-2" />
                    {activeSection === 'staff' ? 'Close' : 'Detect'}
                  </motion.button>
                </div>
                
                <div className="bg-purple-900/30 p-4 rounded-lg mb-4 flex items-center">
                  <div className="bg-purple-500/20 p-3 rounded-full mr-4">
                    <FaUserTie size={24} className="text-purple-300" />
                  </div>
                  <div>
                    <h3 className="font-medium text-purple-300">Staff Count</h3>
                    <p className="text-3xl font-bold">
                      {staffCount !== null ? staffCount : '-'}
                    </p>
                  </div>
                </div>
                
                {activeSection === 'staff' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-800/50 rounded-lg p-4 mb-4"
                  >
                    <div className="flex flex-col md:flex-row gap-3">
                      <input
                        ref={staffInputRef}
                        type="text"
                        placeholder="Enter image URL"
                        value={staffImageUrl}
                        onChange={(e) => setStaffImageUrl(e.target.value)}
                        className="flex-1 bg-gray-700/70 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleImageSubmit('staff')}
                        disabled={isLoading}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaCamera className="mr-2" />}
                        {isLoading ? 'Processing...' : 'Analyze Image'}
                      </motion.button>
                    </div>
                    
                    {staffImageUrl && (
                      <div className="mt-4 bg-gray-800/70 rounded-lg p-2 border border-gray-700">
                        <p className="text-xs text-gray-400 mb-2">Preview:</p>
                        <img 
                          src={staffImageUrl} 
                          alt="Staff preview" 
                          className="w-full h-48 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/api/placeholder/400/300?text=Invalid+Image+URL";
                          }}
                        />
                      </div>
                    )}
                  </motion.div>
                )}
                
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((i) => (
                    <motion.div 
                      key={i}
                      className="bg-purple-900/20 h-24 rounded-lg flex items-center justify-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FaUserTie className="text-purple-500/70" size={24} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Status Messages */}
        {(error || successMessage) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-4 rounded-lg ${error ? 'bg-red-900/40 border border-red-700' : 'bg-green-900/40 border border-green-700'}`}
          >
            <div className="flex items-center">
              {error ? (
                <FaExclamationTriangle className="text-red-400 mr-3" />
              ) : (
                <FaCheckCircle className="text-green-400 mr-3" />
              )}
              <p>{error || successMessage}</p>
            </div>
          </motion.div>
        )}
        
        {/* API Information */}
        <div className="mt-12 bg-gray-800 bg-opacity-40 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold mb-3">How It Works</h3>
          <p className="text-gray-300 mb-4">
            Upload an image URL to detect and count people in queues or staff areas using computer vision.
            Our system uses the Roboflow API to analyze crowd density and provide accurate counts.
          </p>
          <div className="bg-gray-900/70 p-4 rounded-lg">
            <pre className="text-sm text-gray-400 overflow-x-auto">
              <code>
                {`// API Integration Flow
1. Submit image URL for analysis
2. System processes image through Roboflow API
3. Recognition model detects and counts people
4. Results displayed in the dashboard`}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}