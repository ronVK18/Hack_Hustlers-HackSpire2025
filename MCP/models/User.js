// models/User.js

import { Schema, model } from 'mongoose';

const SlotSchema = new Schema({
  center_id: { type: Schema.Types.ObjectId, ref: 'Center', required: true },
  counter_id: { type: String, required: true },   // Example: "C1", "C2"
  waiting_number: { type: Number, required: true }, // Position in the queue
  estimated_wait_time: { type: Number, required: true } ,// In minutes
  status: {
    type: String,
    enum: ['waiting', 'serving', 'completed'],
    default: 'waiting'
  },
});

const UserSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  slots: [SlotSchema], // Array of slot bookings
  created_at: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['waiting', 'serving', 'completed'],
    default: 'waiting'
  },
});

export default model('User', UserSchema);
