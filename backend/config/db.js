const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://anshshr:ansh123@freelancing-platform.esbya.mongodb.net/");
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1); // exit process if fail
  }
};

module.exports = connectDB;
