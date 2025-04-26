import React, { useState } from 'react';
import { 
  FaMapMarkerAlt, FaClipboardList, FaChartLine, FaClock, 
  FaUser, FaSignOutAlt, FaBell, FaCog, FaSearch, 
  FaChartPie, FaCalendarAlt, FaUsers, FaDatabase,
  FaLayerGroup, FaExpandArrowsAlt, FaCompressArrowsAlt
} from 'react-icons/fa';
import { FiMenu, FiX } from 'react-icons/fi';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Counters from './Subdashboard/Counters';
import Map from './Subdashboard/Map';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const location = useLocation();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'} transition-all duration-500`}>
      {/* Sidebar */}
      <AnimatePresence>
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Sidebar 
            sidebarOpen={sidebarOpen} 
            toggleSidebar={toggleSidebar} 
            isDarkMode={isDarkMode}
          />
        </motion.div>
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <TopHeader 
          toggleSidebar={toggleSidebar} 
          isDarkMode={isDarkMode} 
          toggleDarkMode={toggleDarkMode} 
        />

        {/* Page Content */}
        <main className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 transition-all duration-500 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="map-section" element={<Map  />} />
              <Route path="counter-details" element={<Counters />} />
              <Route path="analytics" element={<Analytics isDarkMode={isDarkMode} />} />
              <Route path="*" element={<Map />} /> {/* default fallback */}
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function Sidebar({ sidebarOpen, toggleSidebar, isDarkMode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (route) => {
    navigate(`/dashboard/${route}`);
  };

  const sidebarBg = isDarkMode 
    ? 'bg-gray-800 bg-opacity-70 backdrop-blur-lg backdrop-filter' 
    : 'bg-white bg-opacity-80 backdrop-blur-lg backdrop-filter';

  return (
    <motion.div 
      className={`${sidebarBg} shadow-lg border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} md:static h-full transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-0 md:w-20'} overflow-hidden z-20`}
      animate={{ width: sidebarOpen ? '16rem' : '5rem' }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className={`p-4 flex items-center justify-between border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center">
            <motion.div 
              className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaClock className="text-white text-xl" />
            </motion.div>
            <motion.span 
              className={`ml-3 font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} text-lg transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 md:opacity-0'}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: sidebarOpen ? 1 : 0, x: sidebarOpen ? 0 : -10 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              QueueWise Pro
            </motion.span>
          </div>
          <button className="md:hidden text-gray-500" onClick={toggleSidebar}>
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="py-4 flex-1 overflow-y-auto">
          <nav className="px-2 space-y-1">
            <NavItem
              icon={<FaMapMarkerAlt />}
              text="Map Section"
              active={location.pathname.includes('map-section') || location.pathname === '/dashboard/'}
              onClick={() => handleNavigation('map-section')}
              collapsed={!sidebarOpen}
              isDarkMode={isDarkMode}
            />
            <NavItem
              icon={<FaClipboardList />}
              text="Counter Details"
              active={location.pathname.includes('counter-details')}
              onClick={() => handleNavigation('counter-details')}
              collapsed={!sidebarOpen}
              isDarkMode={isDarkMode}
            />
            <NavItem
              icon={<FaChartLine />}
              text="Analytics"
              active={location.pathname.includes('analytics')}
              onClick={() => handleNavigation('analytics')}
              collapsed={!sidebarOpen}
              isDarkMode={isDarkMode}
            />
            <div className={`my-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
           
          </nav>
        </div>

        {/* User Info */}
        <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center">
            <motion.div 
              className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center`}
              whileHover={{ scale: 1.05 }}
            >
              <FaUser className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
            </motion.div>
            <motion.div 
              className={`ml-3 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: sidebarOpen ? 1 : 0, x: sidebarOpen ? 0 : -10 }}
            >
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Admin User</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>admin@queuewise.pro</p>
            </motion.div>
          </div>
          <motion.button 
            className={`mt-4 flex items-center text-red-500 hover:text-red-400 transition-all ${sidebarOpen ? 'w-full justify-start' : 'justify-center'}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaSignOutAlt />
            <motion.span 
              className={`ml-2 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: sidebarOpen ? 1 : 0 }}
            >
              Log out
            </motion.span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function TopHeader({ toggleSidebar, isDarkMode, toggleDarkMode }) {
  const location = useLocation();

  const pageTitle = () => {
    if (location.pathname.includes('map-section')) return 'Queue Map Overview';
    if (location.pathname.includes('counter-details')) return 'Counter Details';
    if (location.pathname.includes('analytics')) return 'Queue Analytics';
    return 'Dashboard';
  };

  const headerBg = isDarkMode 
    ? 'bg-gray-800 bg-opacity-70 backdrop-blur-lg backdrop-filter' 
    : 'bg-white bg-opacity-80 backdrop-blur-lg backdrop-filter';

  return (
    <header className={`${headerBg} shadow-md z-10 transition-all duration-500`}>
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <motion.button 
            className="md:hidden text-gray-500 mr-2" 
            onClick={toggleSidebar}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiMenu className="h-6 w-6" />
          </motion.button>
          <motion.div 
            className="flex items-center" 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {pageTitle() === 'Queue Map Overview' && <FaMapMarkerAlt className="mr-2 text-blue-500" />}
            {pageTitle() === 'Counter Details' && <FaClipboardList className="mr-2 text-blue-500" />}
            {pageTitle() === 'Queue Analytics' && <FaChartLine className="mr-2 text-blue-500" />}
            <h1 className={`text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{pageTitle()}</h1>
          </motion.div>
        </div>
        <div className="flex items-center space-x-4">
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <input
              type="text"
              placeholder="Search..."
              className={`w-48 lg:w-64 pl-10 pr-4 py-2 rounded-lg ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300`}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </motion.div>
          
          <motion.button 
            className={`p-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} hover:text-blue-500 relative`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaBell />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </motion.button>
          
          <motion.button 
            className={`p-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} hover:text-blue-500`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleDarkMode}
          >
            {isDarkMode ? <FaExpandArrowsAlt /> : <FaCompressArrowsAlt />}
          </motion.button>
          
          <motion.button 
            className={`p-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} hover:text-blue-500`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaCog />
          </motion.button>
        </div>
      </div>
    </header>
  );
}

// Navigation Item
function NavItem({ icon, text, active, onClick, collapsed, isDarkMode }) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative group flex items-center px-2 py-3 w-full rounded-lg transition-colors ${
        active 
          ? isDarkMode 
            ? 'bg-blue-900 bg-opacity-50 text-blue-400' 
            : 'bg-blue-50 text-blue-600'
          : isDarkMode 
            ? 'text-gray-300 hover:bg-gray-700 hover:bg-opacity-50' 
            : 'text-gray-600 hover:bg-gray-100'
      }`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <motion.div 
        className={`${collapsed ? 'mx-auto' : ''} text-lg ${active ? 'text-blue-400' : ''}`}
        whileHover={{ rotate: active ? 0 : 5 }}
      >
        {icon}
      </motion.div>
      <motion.span 
        className={`ml-3 font-medium transition-opacity duration-300 ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: collapsed ? 0 : 1, x: collapsed ? -10 : 0 }}
      >
        {text}
      </motion.span>
      {active && (
        <motion.div 
          className="w-1 h-8 bg-blue-500 absolute right-0 rounded-l-lg"
          initial={{ height: 0 }}
          animate={{ height: '2rem' }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.button>
  );
}

// Simple section components with just placeholder text
function MapSection({ isDarkMode }) {
  const cardBg = isDarkMode 
    ? 'bg-gray-800 bg-opacity-70 backdrop-blur-lg backdrop-filter' 
    : 'bg-white bg-opacity-80 backdrop-blur-lg backdrop-filter';
  
  return (
    <motion.div 
      className="h-screen bg-white"
      key="map"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className={`${cardBg} p-6 rounded-xl shadow-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} min-h-64`}>
        <h2 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} mb-4`}>Map Section</h2>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Welcome to the Map Section page. This is where the map content will be displayed.
        </p>
      </div>
    </motion.div>
  );
}

function CounterDetails({ isDarkMode }) {
  const cardBg = isDarkMode 
    ? 'bg-gray-800 bg-opacity-70 backdrop-blur-lg backdrop-filter' 
    : 'bg-white bg-opacity-80 backdrop-blur-lg backdrop-filter';
  
  return (
    <motion.div 
      className="h-full"
      key="counter"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className={`${cardBg} p-6 rounded-xl shadow-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} min-h-64`}>
        <h2 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} mb-4`}>Counter Details</h2>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Welcome to the Counter Details page. This is where counter information will be displayed.
        </p>
      </div>
    </motion.div>
  );
}

function Analytics({ isDarkMode }) {
  const cardBg = isDarkMode 
    ? 'bg-gray-800 bg-opacity-70 backdrop-blur-lg backdrop-filter' 
    : 'bg-white bg-opacity-80 backdrop-blur-lg backdrop-filter';
  
  return (
    <motion.div 
      className="h-full bg-red-400"
      key="analytics"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className={`${cardBg} p-6 rounded-xl shadow-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} min-h-64`}>
        <h2 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} mb-4`}>Analytics</h2>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Welcome to the Analytics page. This is where analytics data will be displayed.
        </p>
      </div>
    </motion.div>
  );
}