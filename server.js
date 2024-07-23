const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;
app.set('port', PORT);
app.use(cors());
app.use(bodyParser.json());

const url = process.env.MONGODB_URI;  // Using environment variable for MongoDB URI
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect().catch(err => {
  console.error('Failed to connect to MongoDB', err);
  process.exit(1);
});

client.connect(err => {
  if (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
  console.log('Connected to MongoDB');
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

app.post('/api/register', async (req, res) => {
  const { login, password, firstName, lastName, email } = req.body;
  const newUser = { login, password, firstName, lastName, email };

  try {
    const db = client.db('journeyJournal');
    const existingUser = await db.collection('user').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const result = await db.collection('user').insertOne({ ...newUser, verificationCode });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'JourneyJournal Email Verification',
      text: `Your verification code is: ${verificationCode}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: 'Error sending email' });
      } else {
        res.status(200).json({ message: 'Verification code sent to email' });
      }
    });

  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

app.post('/api/verify-code', async (req, res) => {
  const { email, code } = req.body;

  try {
    const db = client.db('journeyJournal');
    const user = await db.collection('user').findOne({ email });

    if (!user || user.verificationCode !== code) {
      return res.status(400).json({ message: 'Invalid code' });
    }

    user.isVerified = true;
    user.verificationCode = null;
    await db.collection('user').updateOne(
      { email },
      { $set: { isVerified: true, verificationCode: null } }
    );

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Additional endpoints

app.get('/api/profile/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const db = client.db('journeyJournal');
    const user = await db.collection('user').findOne({ _id: new ObjectId(id) });
    if (user) {
      res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        login: user.login,
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (e) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update Profile Endpoint
app.put('/api/update-profile/:id', async (req, res) => {
  const { id } = req.params;
  const { login, password } = req.body;

  try {
    const db = client.db('journeyJournal');
    const result = await db.collection('user').updateOne(
      { _id: new ObjectId(id) },
      { $set: { login, password } }
    );
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'Profile updated successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (e) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { login, password } = req.body;

  try {
    const db = client.db('journeyJournal');
    const user = await db.collection('user').findOne({ login, password });
    if (user) {
      res.status(200).json({ id: user._id, firstName: user.firstName, lastName: user.lastName });
    } else {
      res.status(404).json({ error: 'Invalid credentials' });
    }
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Add entry endpoint
app.post('/api/addEntry', async (req, res) => {
  const { userId, title, description, location } = req.body;
  const newEntry = { userId, title, description, location };

  try {
    const db = client.db('journeyJournal');
    const result = await db.collection('journalEntry').insertOne(newEntry);
    res.status(200).json({ _id: result.insertedId });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Delete entry endpoint
app.delete('/api/deleteEntry/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const db = client.db('journeyJournal');
    const result = await db.collection('journalEntry').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount > 0) {
      res.status(200).send('Entry deleted successfully');
    } else {
      res.status(404).send('Entry not found');
    }
  } catch (e) {
    res.status500.json({ error: e.toString() });
  }
});

// Edit entry endpoint
app.put('/api/editEntry/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = client.db('journeyJournal');

    const filter = { _id: new ObjectId(id) };
    const update = { $set: req.body };

    const result = await db.collection('journalEntry').findOneAndUpdate(filter, update);
    if (!result) {
      return res.status(404).send('Entry not found');
    }

    const newResult = await db.collection('journalEntry').findOne({ _id: new ObjectId(id) });

    res.status(200).json(newResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search entry endpoint
app.post('/api/searchEntry', async (req, res) => {
  const { search } = req.body;

  try {
    const db = client.db('journeyJournal');
    const results = await db.collection('journalEntry').find({ title: { $regex: search, $options: 'i' } }).toArray();
    res.status(200).json(results);
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Get endpoint for connection testing
app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
