const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  email: { type: String, required: true, unique: true, dropDups: true },
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, {
  collection: 'user'  // Specify the collection name here
});

module.exports = mongoose.model('user', userSchema);
