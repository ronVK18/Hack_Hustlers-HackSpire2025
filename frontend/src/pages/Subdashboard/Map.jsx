import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FaHospital, FaUserMd, FaUsers, FaArrowLeft } from 'react-icons/fa';
import { MdDarkMode, MdOutlineLightMode } from 'react-icons/md';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom hospital icon
const hospitalIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Ahmedabad hospitals data
const hospitals = [
  {
    id: 1,
    name: "Civil Hospital",
    position: [23.0527, 72.6043],
    totalCounters: 8,
    counters: [
      { id: 1, name: "Registration", queueLength: 15, staffCount: 3 },
      { id: 2, name: "Outpatient", queueLength: 23, staffCount: 5 },
      { id: 3, name: "Emergency", queueLength: 7, staffCount: 8 },
      { id: 4, name: "Laboratory", queueLength: 12, staffCount: 4 },
      { id: 5, name: "Pharmacy", queueLength: 30, staffCount: 6 },
      { id: 6, name: "Radiology", queueLength: 9, staffCount: 4 },
      { id: 7, name: "Billing", queueLength: 18, staffCount: 3 },
      { id: 8, name: "Information", queueLength: 5, staffCount: 2 }
    ]
  },
  {
    id: 2,
    name: "Sterling Hospital",
    position: [23.0225, 72.5714],
    totalCounters: 6,
    counters: [
      { id: 1, name: "Reception", queueLength: 10, staffCount: 2 },
      { id: 2, name: "OPD", queueLength: 18, staffCount: 6 },
      { id: 3, name: "Emergency", queueLength: 3, staffCount: 5 },
      { id: 4, name: "Lab Services", queueLength: 14, staffCount: 3 },
      { id: 5, name: "Medication", queueLength: 22, staffCount: 4 },
      { id: 6, name: "Cashier", queueLength: 8, staffCount: 2 }
    ]
  },
  {
    id: 3,
    name: "Apollo Hospital",
    position: [23.0469, 72.5316],
    totalCounters: 7,
    counters: [
      { id: 1, name: "Main Desk", queueLength: 12, staffCount: 3 },
      { id: 2, name: "Specialist OPD", queueLength: 21, staffCount: 7 },
      { id: 3, name: "Critical Care", queueLength: 5, staffCount: 9 },
      { id: 4, name: "Diagnostics", queueLength: 16, staffCount: 4 },
      { id: 5, name: "Medicine Shop", queueLength: 25, staffCount: 3 },
      { id: 6, name: "Insurance", queueLength: 14, staffCount: 2 },
      { id: 7, name: "Patient Services", queueLength: 9, staffCount: 3 }
    ]
  },
  {
    id: 4,
    name: "CIMS Hospital",
    position: [23.0746, 72.5006],
    totalCounters: 5,
    counters: [
      { id: 1, name: "Registration", queueLength: 17, staffCount: 4 },
      { id: 2, name: "General OPD", queueLength: 28, staffCount: 6 },
      { id: 3, name: "Trauma Center", queueLength: 6, staffCount: 7 },
      { id: 4, name: "Medical Store", queueLength: 19, staffCount: 3 },
      { id: 5, name: "Payment", queueLength: 11, staffCount: 2 }
    ]
  },
  {
    id: 5,
    name: "SAL Hospital",
    position: [23.0117, 72.5253],
    totalCounters: 6,
    counters: [
      { id: 1, name: "Front Desk", queueLength: 13, staffCount: 3 },
      { id: 2, name: "Consultations", queueLength: 22, staffCount: 8 },
      { id: 3, name: "Emergency", queueLength: 4, staffCount: 6 },
      { id: 4, name: "Testing Lab", queueLength: 15, staffCount: 5 },
      { id: 5, name: "Pharmacy", queueLength: 20, staffCount: 3 },
      { id: 6, name: "Accounts", queueLength: 7, staffCount: 2 }
    ]
  }
];

// Map center for Ahmedabad
const city = [23.0225, 72.5714];

function SetViewOnClick({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView(coords, 16);
    }
  }, [coords, map]);
  return null;
}

function Map() {
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [hoveredHospital, setHoveredHospital] = useState(null);
  const [mapType, setMapType] = useState('satellite'); // New state for map type

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleMapType = () => {
    setMapType(mapType === 'satellite' ? 'standard' : 'satellite');
  };

  const handleHospitalClick = (hospital) => {
    setSelectedHospital(hospital);
  };

  const handleBackClick = () => {
    setSelectedHospital(null);
  };

  // Map tile URLs based on type and dark/light mode
  const getMapTileUrl = () => {
    if (mapType === 'satellite') {
      return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    } else if (darkMode) {
      return 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png';
    } else {
      return 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  // Attribution for the map tiles
  const getMapAttribution = () => {
    if (mapType === 'satellite') {
      return '&copy; <a href="https://www.esri.com/">Esri</a>';
    } else {
      return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <FaHospital className="mr-3" /> Ahmedabad Hospital Map
          </h1>
          <div className="flex space-x-3">
            <button
              onClick={toggleMapType}
              className={`px-3 py-2 rounded-md ${
                darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'
              } transition-all`}
            >
              {mapType === 'satellite' ? 'Standard Map' : 'Satellite View'}
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-opacity-20 hover:bg-opacity-30 transition-all"
              aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? (
                <MdOutlineLightMode size={24} />
              ) : (
                <MdDarkMode size={24} />
              )}
            </button>
          </div>
        </div>

        {selectedHospital ? (
          <div className="mb-4">
            <button
              onClick={handleBackClick}
              className={`flex items-center px-4 py-2 rounded-md ${
                darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'
              } transition-all`}
            >
              <FaArrowLeft className="mr-2" /> Back to All Hospitals
            </button>
          </div>
        ) : null}

        <div className={`backdrop-filter backdrop-blur-lg bg-opacity-30 rounded-xl overflow-hidden shadow-xl ${
          darkMode ? 'bg-gray-800 shadow-blue-900/20' : 'bg-white shadow-gray-300/50'
        }`}>
          <div className="h-96 md:h-[600px] relative">
            <MapContainer
              center={city}
              zoom={12}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%" }}
              className="rounded-t-xl z-0"
            >
              <TileLayer
                attribution={getMapAttribution()}
                url={getMapTileUrl()}
              />

              {selectedHospital ? (
                <>
                  <Marker position={selectedHospital.position} icon={hospitalIcon}>
                    <Popup>
                      <div className="font-semibold">{selectedHospital.name}</div>
                    </Popup>
                  </Marker>
                  <SetViewOnClick coords={selectedHospital.position} />
                </>
              ) : (
                hospitals.map((hospital) => (
                  <Marker
                    key={hospital.id}
                    position={hospital.position}
                    icon={hospitalIcon}
                    eventHandlers={{
                      click: () => handleHospitalClick(hospital),
                      mouseover: () => setHoveredHospital(hospital),
                      mouseout: () => setHoveredHospital(null)
                    }}
                  >
                    <Popup>
                      <div 
                        className="font-semibold cursor-pointer hover:text-blue-600" 
                        onClick={() => handleHospitalClick(hospital)}
                      >
                        {hospital.name}
                      </div>
                    </Popup>
                  </Marker>
                ))
              )}
            </MapContainer>
          </div>

          {hoveredHospital && !selectedHospital && (
            <div className={`absolute top-24 right-4 p-4 rounded-lg z-10 shadow-lg backdrop-filter backdrop-blur-md ${
              darkMode ? 'bg-gray-800 bg-opacity-80 text-white border border-gray-700' : 
                       'bg-white bg-opacity-90 text-gray-900 border border-gray-200'
            }`} style={{ width: "280px" }}>
              <h3 className="text-xl font-bold mb-2 flex items-center">
                <FaHospital className="mr-2" /> {hoveredHospital.name}
              </h3>
              <div className="mb-2 flex items-center">
                <FaUserMd className="mr-2" /> 
                <span>Total Counters: {hoveredHospital.totalCounters}</span>
              </div>
              <div className="flex items-center">
                <FaUsers className="mr-2" /> 
                <span>Total Queue: {hoveredHospital.counters.reduce((acc, counter) => acc + counter.queueLength, 0)}</span>
              </div>
              <div className="mt-3 text-sm text-center opacity-80">Click for details</div>
            </div>
          )}

          <div className={`p-6 ${darkMode ? 'bg-gray-800 bg-opacity-80' : 'bg-white bg-opacity-90'}`}>
            {selectedHospital ? (
              <div>
                <h2 className="text-2xl font-bold mb-4">{selectedHospital.name} - Counter Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedHospital.counters.map((counter) => (
                    <div 
                      key={counter.id} 
                      className={`p-4 rounded-lg backdrop-filter backdrop-blur-md ${
                        darkMode ? 
                          'bg-gray-700 bg-opacity-50 border border-gray-600 hover:bg-gray-600' : 
                          'bg-gray-50 bg-opacity-70 border border-gray-200 hover:bg-gray-100'
                      } transition-all`}
                    >
                      <h3 className="font-bold mb-2">Counter {counter.id}: {counter.name}</h3>
                      <div className="flex justify-between mb-1">
                        <span>Queue Length:</span>
                        <span className="font-semibold">{counter.queueLength}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Staff Available:</span>
                        <span className="font-semibold">{counter.staffCount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold mb-4">Ahmedabad Hospitals</h2>
                <p className="mb-3">Hover over a hospital marker to see basic information. Click on a hospital to view detailed counter information.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {hospitals.map((hospital) => (
                    <div 
                      key={hospital.id}
                      onClick={() => handleHospitalClick(hospital)}
                      className={`p-4 rounded-lg cursor-pointer backdrop-filter backdrop-blur-md ${
                        darkMode ? 
                          'bg-gray-700 bg-opacity-50 border border-gray-600 hover:bg-gray-600' : 
                          'bg-gray-50 bg-opacity-70 border border-gray-200 hover:bg-gray-100'
                      } transition-all`}
                    >
                      <h3 className="font-bold mb-2 flex items-center">
                        <FaHospital className="mr-2" /> {hospital.name}
                      </h3>
                      <div className="flex justify-between mb-1">
                        <span>Total Counters:</span>
                        <span className="font-semibold">{hospital.totalCounters}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Queue:</span>
                        <span className="font-semibold">
                          {hospital.counters.reduce((acc, counter) => acc + counter.queueLength, 0)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Map;