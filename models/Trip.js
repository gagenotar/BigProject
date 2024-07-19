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
  image: { type: String }, // Made image field not required
  date: { type: Date, default: Date.now }, // Add date field
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware to update the updatedAt field before each save
createSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Create', createSchema);
// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const tripSchema = new Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   location: {
//     street: { type: String },
//     city: { type: String },
//     state: { type: String },
//     country: { type: String }
//   },
//   rating: { type: Number },
//   imageUrl: { type: String }, 
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Trip', tripSchema);
