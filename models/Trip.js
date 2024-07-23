// models/Trip.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const createSchema = new Schema({
  title: { type: String, required: true },
  location: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
  },
  rating: { type: Number, required: true, min: 1, max: 5 },
  description: { type: String, required: true },
  image: { type: String }, 
  date: { type: Date, default: Date.now }, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Add userId field
});

// Middleware to update the updatedAt field before each save
createSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Create', createSchema);