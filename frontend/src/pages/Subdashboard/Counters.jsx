// src/components/HospitalList.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Adjust path if needed
import { collection, getDocs } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { FaHospital, FaUserMd, FaUserNurse, FaUsers } from "react-icons/fa";
import { MdDarkMode, MdLightMode, MdArrowBack, MdArrowForward } from "react-icons/md";
import { BsClockFill, BsPeopleFill } from "react-icons/bs";
import { Link } from "react-router-dom";

const Counters = () => {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [currentCounterIndex, setCurrentCounterIndex] = useState(0);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const hospitalsCollection = collection(db, "hospitals");
        const hospitalSnapshot = await getDocs(hospitalsCollection);
        const hospitalList = hospitalSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setHospitals(hospitalList);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  const handleHospitalClick = (hospital) => {
    setSelectedHospital(hospital);
    setCurrentCounterIndex(0);
  };

  const handleNextCounter = () => {
    if (selectedHospital && selectedHospital.counters) {
      setCurrentCounterIndex((prev) => 
        prev === selectedHospital.counters.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handlePrevCounter = () => {
    if (selectedHospital && selectedHospital.counters) {
      setCurrentCounterIndex((prev) => 
        prev === 0 ? selectedHospital.counters.length - 1 : prev - 1
      );
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold flex items-center"
          >
            <FaHospital className="mr-3 text-blue-500" size={30} />
            Hospital Queue Management
          </motion.h1>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleDarkMode}
            className={`p-3 rounded-full ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-white text-gray-800'} shadow-lg flex items-center justify-center`}
          >
            {darkMode ? <MdLightMode size={24} /> : <MdDarkMode size={24} />}
          </motion.button>
        </div>

        <div className="grid md:grid-cols-12 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`md:col-span-4 ${!selectedHospital && 'md:col-span-12'}`}
          >
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800 bg-opacity-60' : 'bg-white bg-opacity-80'} backdrop-blur-lg shadow-xl`}>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FaHospital className="mr-2 text-blue-500" />
                Hospitals
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {hospitals.map(hospital => (
                  <motion.div
                    key={hospital.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleHospitalClick(hospital)}
                    className={`cursor-pointer p-4 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} transition duration-300 border-l-4 ${selectedHospital?.id === hospital.id ? 'border-blue-500' : darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                  >
                    <h3 className="font-semibold text-lg">{hospital.name}</h3>
                    <div className="flex justify-between mt-2 text-sm">
                      <span className="flex items-center">
                        <BsPeopleFill className="mr-1 text-blue-400" />
                        {hospital.totalCounters} Counters
                      </span>
                      <span className="flex items-center">
                        <FaUserMd className="mr-1 text-green-400" />
                        {hospital.counters?.reduce((acc, counter) => acc + counter.staffCount, 0) || 0} Staff
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {selectedHospital && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="md:col-span-8"
            >
              <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800 bg-opacity-60' : 'bg-white bg-opacity-80'} backdrop-blur-lg shadow-xl h-full`}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold flex items-center">
                    <FaHospital className="mr-2 text-blue-500" />
                    {selectedHospital.name}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedHospital(null)}
                    className={`px-3 py-1 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} text-sm flex items-center`}
                  >
                    <MdArrowBack className="mr-1" /> Back to List
                  </motion.button>
                </div>

                {selectedHospital.counters && selectedHospital.counters.length > 0 ? (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handlePrevCounter}
                        className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                      >
                        <MdArrowBack size={24} />
                      </motion.button>
                      <h3 className="text-lg font-medium">
                        Counter {currentCounterIndex + 1} of {selectedHospital.counters.length}
                      </h3>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleNextCounter}
                        className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                      >
                        <MdArrowForward size={24} />
                      </motion.button>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentCounterIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700 bg-opacity-70' : 'bg-gray-50 bg-opacity-90'} backdrop-blur-lg shadow-lg`}
                      >
                        <div className="text-center mb-6">
                          <h3 className="text-xl font-bold mb-2">{selectedHospital.counters[currentCounterIndex].name}</h3>
                          <div className={`inline-block px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                            {selectedHospital.counters[currentCounterIndex].department || "General"}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Queue Length</span>
                              <BsClockFill className={`${parseInt(selectedHospital.counters[currentCounterIndex].queueLength) > 5 ? 'text-red-500' : 'text-green-500'}`} />
                            </div>
                            <div className="flex items-end mt-2">
                              <span className="text-3xl font-bold">{selectedHospital.counters[currentCounterIndex].queueLength || 0}</span>
                              <span className="ml-2 text-sm text-gray-500">patients</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full mt-3">
                              <div 
                                className={`h-2 rounded-full ${parseInt(selectedHospital.counters[currentCounterIndex].queueLength) > 5 ? 'bg-red-500' : 'bg-green-500'}`} 
                                style={{ width: `${Math.min(parseInt(selectedHospital.counters[currentCounterIndex].queueLength) * 10, 100)}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Staff Available</span>
                              <FaUsers className="text-blue-500" />
                            </div>
                            <div className="flex items-end mt-2">
                              <span className="text-3xl font-bold">{selectedHospital.counters[currentCounterIndex].staffCount || 0}</span>
                              <span className="ml-2 text-sm text-gray-500">members</span>
                            </div>
                            <div className="mt-3 flex">
                              {[...Array(parseInt(selectedHospital.counters[currentCounterIndex].staffCount || 0))].map((_, i) => (
                                i < 5 ? (
                                  <div key={i} className="mr-1">
                                    {i % 2 === 0 ? 
                                      <FaUserMd className="text-blue-500" size={16} /> : 
                                      <FaUserNurse className="text-pink-500" size={16} />
                                    }
                                  </div>
                                ) : (i === 5 ? <span className="text-sm">+{parseInt(selectedHospital.counters[currentCounterIndex].staffCount) - 5}</span> : null)
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md mb-4`}>
                          <h4 className="font-medium mb-2">Staff Details</h4>
                          <div className="space-y-2">
                            {selectedHospital.counters[currentCounterIndex].staffDetails ? (
                              selectedHospital.counters[currentCounterIndex].staffDetails.map((staff, idx) => (
                                <div key={idx} className={`p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center`}>
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    staff.role === 'Doctor' ? 'bg-blue-200 text-blue-700' : 
                                    staff.role === 'Nurse' ? 'bg-pink-200 text-pink-700' : 
                                    'bg-green-200 text-green-700'
                                  }`}>
                                    {staff.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="ml-3">
                                    <p className="font-medium">{staff.name}</p>
                                    <p className="text-xs text-gray-500">{staff.role}</p>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm">No detailed staff information available</p>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <Link
                           to="/counter-details"
                            className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white flex items-center`}
                          >
                            View Full Details
                          </Link>
                          
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white flex items-center`}
                          >
                            Check Wait Time
                          </motion.button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p>No counters available for this hospital</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Counters;