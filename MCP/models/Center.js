// models/Center.js

import { Schema, model } from 'mongoose';

const CounterSchema = new Schema({
  counter_id: { type: String, required: true },
  current_serving: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  queue: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

const CenterSchema = new Schema({
  name: { type: String, required: true },
  number_of_counters: { type: Number, required: true },
  counters: [CounterSchema],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default model('Center', CenterSchema);
