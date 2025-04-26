import React, { useState, useEffect } from 'react';
import { 
  FaUser, 
  FaUserClock, 
  FaHistory, 
  FaHourglassHalf, 
  FaCloudRain, 
  FaUsers,
  FaUserTie
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import CountBoth from './CountBoth';
import { db } from './firebase'; // Adjust path if needed
import { collection, getDocs } from 'firebase/firestore';

export default function CounterDetail() {
  const [tickets, setTickets] = useState([]);
  const [historicalData, setHistoricalData] = useState({});
  const [waitTimeData, setWaitTimeData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const ticketsCollection = collection(db, "queueTickets");
        const ticketSnapshot = await getDocs(ticketsCollection);
        const ticketList = ticketSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTickets(ticketList);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTickets();
  }, []);

  const fetchHistoricalCount = (ticketId) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const historicalCount = Math.floor(Math.random() * 10) + 1;
      setHistoricalData(prev => ({
        ...prev,
        [ticketId]: historicalCount
      }));
      setIsLoading(false);
    }, 1000);
  };

  const fetchWaitTime = async (ticketId) => {
    setIsLoading(true);
    
    try {
      // Updated to call your backend route instead of the external API directly
      const response = await fetch('http://localhost:5000/api/predict-wait-time', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_queue_length: tickets.length,
          staff_count: 3,
          historical_throughput: 4.2,
          is_holiday: false,
          weather_condition: "rainy"
        }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      
      // Extract the predicted wait time from the response
      const waitTimeValue = data.predicted_wait_time_minutes 
        ? parseFloat(data.predicted_wait_time_minutes).toFixed(1)
        : Math.floor(Math.random() * 20) + 5; // Fallback if API doesn't return expected format
      
      // Store the wait time in state
      setWaitTimeData(prev => ({
        ...prev,
        [ticketId]: waitTimeValue
      }));
      
    } catch (error) {
      console.error('Error fetching wait time:', error);
      // Fallback prediction for demo
      setWaitTimeData(prev => ({
        ...prev,
        [ticketId]: Math.floor(Math.random() * 20) + 5
      }));
    }
    
    setIsLoading(false);
  };

  const handleAnalyze = (ticket) => {
    console.log("Analyzing Ticket:", ticket);
    // you can later add custom logic here (maybe open a modal or show AI prediction)
    alert(`Analyzing ticket for ${ticket.userName}`);
  };

  // Split tickets into two groups for the tables
  const tableData = tickets.length > 0 ? [
    ...tickets.slice(0, Math.ceil(tickets.length / 2)),
    ...tickets.slice(Math.ceil(tickets.length / 2))
  ] : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Queue Management System</h1>
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center">
              <FaUsers className="text-blue-400 mr-2" />
              <span>Queue Length: {tickets.length}</span>
            </div>
            <div className="flex items-center">
              <FaUserTie className="text-green-400 mr-2" />
              <span>Staff: 3</span>
            </div>
            <div className="flex items-center">
              <FaCloudRain className="text-purple-400 mr-2" />
              <span>Weather: Rainy</span>
            </div>
          </div>
        </header>

        <CountBoth/>

        {/* Queue Visualization */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 overflow-x-auto pb-4"
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <FaUsers className="text-blue-500 mr-2" />
            Current Queue
          </h2>
          
          <div className="flex items-end space-x-4 bg-gray-800 bg-opacity-40 backdrop-blur-lg p-6 rounded-xl border border-gray-700">
            <div className="p-4 bg-blue-500 text-white rounded-md">
              <FaUserClock size={28} />
              <div className="mt-1">Counter</div>
            </div>
            
            {tickets.map((ticket, index) => (
              <motion.div 
                key={ticket.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative flex flex-col items-center"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  index < 3 ? 'bg-red-500' : 
                  index < 7 ? 'bg-yellow-500' : 'bg-green-500'
                } bg-opacity-80`}>
                  <FaUser size={20} />
                </div>
                <div className="mt-2 text-xs text-center font-medium">{ticket.userName?.split(' ')[0] || 'User'}</div>
                <div className="text-xs text-gray-400">#{ticket.queuePosition}</div>
                
                {/* Connector line */}
                {index < tickets.length - 1 && (
                  <div className="absolute top-6 left-12 w-8 h-0.5 bg-gray-600"></div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Customer Details Tables */}
        <div className="w-full flex flex-col space-y-8">
          {[0, 1].map((tableIndex) => (
            tickets.slice(tableIndex * Math.ceil(tickets.length / 2), (tableIndex + 1) * Math.ceil(tickets.length / 2)).length > 0 && (
              <motion.div
                key={tableIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + tableIndex * 0.2 }}
                className="bg-gray-800 bg-opacity-40 backdrop-blur-lg rounded-xl border border-gray-700 overflow-hidden"
              >
                <h3 className="p-4 bg-gray-700 bg-opacity-50 text-xl font-semibold">
                  Customer Group {tableIndex + 1}
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-800 bg-opacity-50">
                        <th className="p-3 text-left">Customer</th>
                        <th className="p-3 text-left">Phone</th>
                        <th className="p-3 text-left">Hospital</th>
                        <th className="p-3 text-left">Counter</th>
                        <th className="p-3 text-left">Queue Pos.</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Purpose</th>
                        <th className="p-3 text-left">Joined At</th>
                        <th className="p-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.slice(tableIndex * Math.ceil(tickets.length / 2), (tableIndex + 1) * Math.ceil(tickets.length / 2)).map((ticket) => (
                        <tr key={ticket.id} className="border-t border-gray-700 hover:bg-gray-700 hover:bg-opacity-40 transition duration-200">
                          <td className="p-3">
                            <div className="flex items-center space-x-3">
                              <img 
                                src={`/api/placeholder/40/40?text=${ticket.queuePosition || 'U'}`}
                                alt={ticket.userName} 
                                className="w-8 h-8 rounded-full border border-gray-600"
                              />
                              <div className="font-medium">{ticket.userName}</div>
                            </div>
                          </td>
                          <td className="p-3">{ticket.phoneNumber}</td>
                          <td className="p-3">{ticket.hospitalName}</td>
                          <td className="p-3">{ticket.counterName}</td>
                          <td className="p-3">{ticket.queuePosition}</td>
                          <td className="p-3 capitalize">{ticket.status}</td>
                          <td className="p-3">{ticket.purpose}</td>
                          <td className="p-3">
                            {ticket.joinedAt?.toDate
                              ? new Date(ticket.joinedAt.toDate()).toLocaleString()
                              : "N/A"}
                          </td>
                          <td className="p-3">
  <div className="flex flex-col items-center">
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => fetchWaitTime(ticket.id)}
      disabled={isLoading}
      className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded flex items-center text-sm disabled:opacity-50"
    >
      <FaHourglassHalf className="mr-1" /> Wait Time
    </motion.button>

    {waitTimeData[ticket.id] && (
      <div className="mt-2 px-3 py-1 bg-yellow-500 text-black font-bold text-lg rounded-md shadow-md">
        {waitTimeData[ticket.id]} min
      </div>
    )}
  </div>
</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )
          ))}
        </div>
        
        {/* Loading Indicator */}
        {isLoading && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-md">
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
    />
  </div>
)}
      </div>
    </div>
  );
}