const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, dropDups: true },
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verificationCode: {type: String, required: false},
  isVerified: {type: Boolean, default: false},
  resetPasswordCode: {type: String},
  resetPasswordExpires: {type: Date},
}, {
  collection: 'user'  // Specify the collection name here
});

module.exports = mongoose.model('user', userSchema);
