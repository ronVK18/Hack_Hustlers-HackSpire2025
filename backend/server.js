const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const sampleRoutes = require('./routes/sampleRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect DB
const connectDB = require('./config/db');
connectDB();

// Routes
app.use('/api/', sampleRoutes);

// Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
