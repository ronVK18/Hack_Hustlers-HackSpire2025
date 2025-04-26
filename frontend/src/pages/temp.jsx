import { useState, useEffect } from "react";
import { 
  FaUserClock, 
  FaExclamationTriangle, 
  FaUsers, 
  FaTools, 
  FaCheckCircle, 
  FaPaperPlane,
  FaArrowRight,
  FaClock
} from "react-icons/fa";

export default function AppointmentCalculator() {
  const [formData, setFormData] = useState({
    crowdStrike: 2,
    abandon: 15,
    equipmentFailure: 15,
    staffShortage: 5,
  });
  
  const [queueInfo, setQueueInfo] = useState({
    queueLength: 12,
    arrivalRate: 2.5,
    departureRate: 9.0,
    timeOfDay: 18
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Formula to calculate delay or early time
  const calculateTimeDifference = () => {
    // Weight factors for each parameter
    const crowdFactor = 2.5;
    const abandonFactor = 0.8;
    const equipmentFactor = 1.5;
    const staffFactor = 3.2;
    
    // Calculate the weighted impact of each parameter
    const crowdImpact = (formData.crowdStrike - 2) * crowdFactor; // 0 if minimum value
    const abandonImpact = (formData.abandon - 5) * abandonFactor; // Using lower bound as base
    const equipmentImpact = formData.equipmentFailure * equipmentFactor;
    const staffImpact = (5 - formData.staffShortage) * staffFactor; // 5 is optimal, less is worse
    
    // Final calculation (positive = delay, negative = early)
    let timeDifference = crowdImpact + abandonImpact + equipmentImpact - staffImpact;
    
    // Bottleneck factor adjustment (if bottleneck exists, increase delay)
    if (result && result.bottleneck) {
      timeDifference += 15; // Add 15 minutes if bottleneck exists
    }
    
    return Math.round(timeDifference);
  };
  
  const checkBottleneck = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/check-bottleneck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(queueInfo),
      });
      
      const data = await response.json();
      setResult(data);
      setStep(3);
    } catch (error) {
      console.error("Error checking bottleneck:", error);
      setResult({ bottleneck: false, confidence: 3.83322640118422e-06 });
      setStep(3);
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: Number(value),
    });
  };
  
  const handleQueueInfoChange = (e) => {
    const { name, value } = e.target;
    setQueueInfo({
      ...queueInfo,
      [name]: Number(value),
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };
  
  const sendOTP = () => {
    // Simulate OTP sending
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1500);
  };
  
  const getTimeDifferenceText = () => {
    const difference = calculateTimeDifference();
    
    if (difference === 0) {
      return "Your appointment is on time.";
    } else if (difference > 0) {
      return `Your appointment is delayed by ${difference} minutes.`;
    } else {
      return `Your appointment is earlier by ${Math.abs(difference)} minutes.`;
    }
  };
  
  const getReasonText = () => {
    const timeDiff = calculateTimeDifference();
    
    if (timeDiff > 0) {
      return "Due to high crowd volume and resource constraints, we need to verify your appointment.";
    } else if (timeDiff < 0) {
      return "Since we're ahead of schedule, we'd like to confirm if you can arrive earlier.";
    } else {
      return "To confirm your on-time appointment, verification is required.";
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-400 mb-6 flex items-center">
          <FaClock className="mr-3" /> Appointment Time Calculator
        </h1>

        {/* Timeline */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center">
                <div className={`rounded-full h-10 w-10 flex items-center justify-center ${
                  step >= i ? "bg-blue-600" : "bg-gray-700"
                } ${step === i ? "ring-4 ring-blue-400" : ""}`}>
                  {i}
                </div>
                {i < 4 && (
                  <div className={`h-1 w-16 ${step > i ? "bg-blue-600" : "bg-gray-700"}`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>Parameters</span>
            <span>Queue Data</span>
            <span>Results</span>
            <span>Confirmation</span>
          </div>
        </div>

        {/* Step 1: Parameters Form */}
        {step === 1 && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6 animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4 text-blue-300">Operational Parameters</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center text-gray-300">
                    <FaUsers className="mr-2 text-yellow-400" /> Crowd Strike (2-5)
                  </label>
                  <input
                    type="range"
                    name="crowdStrike"
                    min="2"
                    max="5"
                    step="0.1"
                    value={formData.crowdStrike}
                    onChange={handleInputChange}
                    className="w-full accent-blue-500 bg-gray-700"
                  />
                  <div className="flex justify-between text-sm">
                    <span>2 (Low)</span>
                    <span>{formData.crowdStrike}</span>
                    <span>5 (High)</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center text-gray-300">
                    <FaExclamationTriangle className="mr-2 text-orange-400" /> Abandonment Rate (5-15)
                  </label>
                  <input
                    type="range"
                    name="abandon"
                    min="5"
                    max="15"
                    step="1"
                    value={formData.abandon}
                    onChange={handleInputChange}
                    className="w-full accent-blue-500 bg-gray-700"
                  />
                  <div className="flex justify-between text-sm">
                    <span>5 (Low)</span>
                    <span>{formData.abandon}</span>
                    <span>15 (High)</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center text-gray-300">
                    <FaTools className="mr-2 text-red-400" /> Equipment Failure Recovery (min)
                  </label>
                  <input
                    type="number"
                    name="equipmentFailure"
                    min="0"
                    max="60"
                    value={formData.equipmentFailure}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center text-gray-300">
                    <FaUserClock className="mr-2 text-purple-400" /> Staff Shortage (3-5)
                  </label>
                  <input
                    type="range"
                    name="staffShortage"
                    min="3"
                    max="5"
                    step="0.1"
                    value={formData.staffShortage}
                    onChange={handleInputChange}
                    className="w-full accent-blue-500 bg-gray-700"
                  />
                  <div className="flex justify-between text-sm">
                    <span>3 (Severe)</span>
                    <span>{formData.staffShortage}</span>
                    <span>5 (Optimal)</span>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md flex items-center justify-center w-full md:w-auto"
              >
                Continue <FaArrowRight className="ml-2" />
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Queue Information */}
        {step === 2 && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6 animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4 text-blue-300">Queue Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-gray-300">Queue Length</label>
                <input
                  type="number"
                  name="queueLength"
                  value={queueInfo.queueLength}
                  onChange={handleQueueInfoChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-gray-300">Arrival Rate (per hour)</label>
                <input
                  type="number"
                  name="arrivalRate"
                  step="0.1"
                  value={queueInfo.arrivalRate}
                  onChange={handleQueueInfoChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-gray-300">Departure Rate (per hour)</label>
                <input
                  type="number"
                  name="departureRate"
                  step="0.1"
                  value={queueInfo.departureRate}
                  onChange={handleQueueInfoChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-gray-300">Time of Day (24h format)</label>
                <input
                  type="number"
                  name="timeOfDay"
                  min="0"
                  max="23"
                  value={queueInfo.timeOfDay}
                  onChange={handleQueueInfoChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-md"
              >
                Back
              </button>
              <button
                onClick={checkBottleneck}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md flex-1 flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-pulse">Processing...</div>
                ) : (
                  <>Check Bottleneck <FaArrowRight className="ml-2" /></>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && result && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6 animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4 text-blue-300">Appointment Status</h2>
            
            <div className="bg-gray-700 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-lg mb-2">Bottleneck Analysis</h3>
              <div className="flex items-center text-lg">
                <div className={`rounded-full h-4 w-4 mr-2 ${result.bottleneck ? "bg-red-500" : "bg-green-500"}`}></div>
                <span>
                  {result.bottleneck 
                    ? "Bottleneck detected in the system" 
                    : "No bottleneck detected in the system"}
                </span>
              </div>
              <div className="text-sm text-gray-400 mt-1">
                Confidence: {(result.confidence * 100).toFixed(6)}%
              </div>
            </div>
            
            <div className="bg-blue-900/30 border border-blue-700/50 p-6 rounded-lg mb-6">
              <h3 className="font-bold text-2xl mb-2 text-center">{getTimeDifferenceText()}</h3>
              
              <div className="flex justify-center items-center my-4">
                {calculateTimeDifference() > 0 ? (
                  <div className="text-red-400 text-6xl font-bold">+{calculateTimeDifference()}</div>
                ) : calculateTimeDifference() < 0 ? (
                  <div className="text-green-400 text-6xl font-bold">{calculateTimeDifference()}</div>
                ) : (
                  <div className="text-yellow-400 text-6xl font-bold">0</div>
                )}
                <div className="ml-2 text-lg">minutes</div>
              </div>
              
              <div className="mt-3 text-gray-300">
                <h4 className="font-semibold mb-1">Factors affecting your appointment:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Crowd level: {formData.crowdStrike}/5</li>
                  <li>• Abandonment rate: {formData.abandon} minutes</li>
                  <li>• Equipment recovery time: {formData.equipmentFailure} minutes</li>
                  <li>• Staff availability: {formData.staffShortage}/5</li>
                  <li>• System bottleneck: {result.bottleneck ? "Yes" : "No"}</li>
                </ul>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-md"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md flex-1 flex items-center justify-center"
              >
                Continue to Verification <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: OTP Verification */}
        {step === 4 && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4 text-blue-300">Appointment Verification</h2>
            
            <div className="mb-6">
              <p className="mb-4">{getReasonText()}</p>
              <p className="font-semibold">
                Click the button below to send a verification code to your registered mobile number.
              </p>
            </div>
            
            <button
              onClick={sendOTP}
              disabled={loading || otpSent}
              className={`w-full py-3 rounded-md flex items-center justify-center font-semibold ${
                otpSent 
                  ? "bg-green-700 text-white cursor-default" 
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? (
                <div className="animate-pulse">Sending...</div>
              ) : otpSent ? (
                <div className="flex items-center">
                  <FaCheckCircle className="mr-2" /> Verification Code Sent
                </div>
              ) : (
                <div className="flex items-center">
                  <FaPaperPlane className="mr-2" /> Send Verification Code
                </div>
              )}
            </button>
            
            <div className="mt-6">
              <button
                onClick={() => setStep(3)}
                className="text-gray-400 hover:text-gray-300"
              >
                Back to Results
              </button>
            </div>
          </div>
        )}
        
        {/* Success Popup */}
        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 animate-fadeIn">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-4 shadow-xl border border-green-500/30">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                  <FaCheckCircle className="text-green-500 text-4xl" />
                </div>
                <h3 className="text-xl font-bold mb-2">Success!</h3>
                <p className="text-center mb-4">
                  Verification code has been sent to your registered mobile number.
                </p>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}