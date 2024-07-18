const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const journalEntrySchema = new Schema({
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model('journalEntry', journalEntrySchema);