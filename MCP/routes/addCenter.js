// routes/centerRoutes.js
import express from 'express';
import Center from '../models/Center.js';
import User from '../models/User.js';

const router = express.Router();

// Create a new center with counters
router.post('/centers', async (req, res) => {
  try {
    const { name, number_of_counters } = req.body;
    
    if (!name || !number_of_counters) {
      return res.status(400).json({ message: 'Name and number of counters are required' });
    }
    
    // Create counters array based on number_of_counters
    const counters = [];
    for (let i = 1; i <= number_of_counters; i++) {
      counters.push({
        counter_id: `${name.replace(/\s+/g, '-').toLowerCase()}-counter-${i}`,
        queue: []
      });
    }
    
    // Create new center
    const newCenter = new Center({
      name,
      number_of_counters,
      counters
    });
    
    const savedCenter = await newCenter.save();
    res.status(201).json(savedCenter);
  } catch (error) {
    console.error('Error creating center:', error);
    res.status(500).json({ message: 'Failed to create center', error: error.message });
  }
});

// Get all centers
router.get('/centers', async (req, res) => {
  try {
    const centers = await Center.find();
    res.status(200).json(centers);
  } catch (error) {
    console.error('Error fetching centers:', error);
    res.status(500).json({ message: 'Failed to fetch centers', error: error.message });
  }
});

// Add a counter to an existing center
router.post('/centers/:centerId/counters', async (req, res) => {
  try {
    const { centerId } = req.params;
    const center = await Center.findById(centerId);
    
    if (!center) {
      return res.status(404).json({ message: 'Center not found' });
    }
    
    // Create a new counter
    const newCounter = {
      counter_id: `${center.name.replace(/\s+/g, '-').toLowerCase()}-counter-${center.counters.length + 1}`,
      queue: []
    };
    
    // Add counter to the center
    center.counters.push(newCounter);
    center.number_of_counters = center.counters.length;
    center.updated_at = Date.now();
    
    const updatedCenter = await center.save();
    res.status(201).json(updatedCenter);
  } catch (error) {
    console.error('Error adding counter:', error);
    res.status(500).json({ message: 'Failed to add counter', error: error.message });
  }
});

router.post('/complete-service/:centerId/:counterId', async (req, res) => {
  try {
    const { centerId, counterId } = req.params;
    
    // Find the center and counter
    const center = await Center.findById(centerId);
    if (!center) {
      return res.status(404).json({ message: 'Center not found' });
    }
    
    const counterIndex = center.counters.findIndex(c => c.counter_id === counterId);
    if (counterIndex === -1) {
      return res.status(404).json({ message: 'Counter not found in this center' });
    }
    
    const counter = center.counters[counterIndex];
    
    // Check if there is a user being served
    if (!counter.queue.length) {
      return res.status(400).json({ message: 'No user currently being served' });
    }
    
    // Find the user being served
    const currentUser = await User.findById(counter.queue[0]);
    if (currentUser) {
      // Update user status to completed
      currentUser.status = 'completed';
      await currentUser.save();
    }
    
    counter.queue.shift()
    await center.save();
    
    res.status(200).json({
      message: 'Service completed',
      completed_user: currentUser || { message: 'User not found in database' }
    });
    
  } catch (error) {
    console.error('Error completing service:', error);
    res.status(500).json({ message: 'Failed to complete service', error: error.message });
  }
});


export default router;