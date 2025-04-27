// routes/userRoutes.js
import express from 'express';
import User from '../models/User.js';
import Center from '../models/Center.js';
import axios from 'axios';
import { isHoliday, predictWeather } from '../utils/functions.js';

const router = express.Router();
router.get("/get_user",async (req,res)=>{
    const {name}=await req.body;
    const user=await User.findOne({name:name});
    if(!user){
        return res.status(404).json({sucess:false,message:"User not found"})
    }
    return res.status(200).json({sucess:true,message:user._id})
})
router.post("/get_details",async (req,res)=>{
    const {name}=req.body;
    const user=await User.findOne({name:name});
    if(!user){
        return res.status(404).json({sucess:false,message:"User not found"})
    }
    return res.status(200).json({sucess:true,message:user.slots})
})
// Create a new user
router.post('/users', async (req, res) => {
  try {
    const { name, phone } = req.body;
    
    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and phone are required' });
    }
    
    // Check if user with this phone already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(409).json({ 
        message: 'User with this phone number already exists',
        user: existingUser
      });
    }
    
    // Create new user
    const newUser = new User({
      name,
      phone,
      slots: []
    });
    
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
});

// Add a slot booking for a user
router.post('/users/:userId/slots', async (req, res) => {
  try {
    const { userId } = req.params;
    const { center_id, counter_id } = req.body;
    
    if (!center_id || !counter_id) {
      return res.status(400).json({ message: 'Center ID and counter ID are required' });
    }
    
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' }); 
    }
    
    // Find the center and counter
    const center = await Center.findById({name:center_id});
    if (!center) {
      return res.status(404).json({ message: 'Center not found' });
    }
    
    const counter = center.counters.find(c => c.counter_id === counter_id);
    if (!counter) {
      return res.status(404).json({ message: 'Counter not found in this center' });
    }
    
    // Calculate waiting number (queue size + 1)
    const waitingNumber = counter.queue.length + 1;
    
    // Add user to counter queue
    counter.queue.push(user._id);
    await center.save();
    const response=await axios.post('https://queue-3-vvk0.onrender.com/predict', {
        "current_queue_length": counter.queue.length+1,
        "staff_count": center.number_of_counters,
        "historical_throughput": 4.2,
        "is_holiday": isHoliday().isHoliday,
        "weather_condition": predictWeather()
    })
    const wait_time=response.data.predicted_wait_time_minutes
    // Add slot to user with 0 wait time initially
    const newSlot = {
      center_id: center._id,
      counter_id: counter_id,
      waiting_number: waitingNumber,
      estimated_wait_time: wait_time // Initially set to 0
    };
    
    user.slots.push(newSlot);
    user.status = 'waiting';
    const updatedUser = await user.save();
    
    res.status(201).json({
      message: 'Slot added successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error adding slot:', error);
    res.status(500).json({ message: 'Failed to add slot', error: error.message });
  }
});

// Calculate estimated wait time for a slot
router.post('/calculate-wait-time/:userId/:counterId', async (req, res) => {
    try {
      const { userId, counterId } = req.params;
      
      // Find the user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Find the specific slot with the given counter_id
      const slotIndex = user.slots.findIndex(slot => slot.counter_id === counterId);
      if (slotIndex === -1) {
        return res.status(404).json({ message: 'Slot not found for this counter' });
      }
      
      const slot = user.slots[slotIndex];
      
      // Parameters for wait time calculation
      const data = {
        "current_queue_length": slot.waiting_number,
        "staff_count": 1, // Assuming 1 staff per counter
        "historical_throughput": 4.2, // Average time per customer
        "is_holiday": isHoliday().isHoliday,
        "weather_condition": predictWeather()
      };
      
      try {
        // Call external API to predict wait time
        const response = await axios.post('https://queue-3-vvk0.onrender.com/predict', data);
        
        // Update the slot with the calculated wait time
        user.slots[slotIndex].estimated_wait_time = response.data.predicted_wait_time_minutes;
        await user.save();
        
        return res.status(200).json({
          message: 'Wait time calculated successfully',
          wait_time: response.data.predicted_wait_time_minutes,
          user: user
        });
      } catch (apiError) {
        console.error('API call failed:', apiError.response?.data || apiError.message);
        
        // Fallback calculation if API call fails
        let waitTime = data.current_queue_length * (1 / data.historical_throughput);
        if (data.is_holiday) waitTime *= 1.3;
        if (data.weather_condition === 'rainy') waitTime *= 1.2;
        else if (data.weather_condition === 'cloudy') waitTime *= 1.1;
        
        user.slots[slotIndex].estimated_wait_time = Math.round(waitTime);
        await user.save();
        
        return res.status(200).json({
          message: 'Wait time calculated using fallback method',
          wait_time: Math.round(waitTime),
          user: user
        });
      }
    } catch (error) {
      console.error('Error calculating wait time:', error);
      res.status(500).json({ message: 'Failed to calculate wait time', error: error.message });
    }
  });
// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().populate('slots.center_id');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

export default router;