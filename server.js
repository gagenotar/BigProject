const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MongoDB
client.connect().catch(err => {
  console.error('Failed to connect to MongoDB', err);
  process.exit(1);
});

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// CORS setup
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}

// Add Trip endpoint
app.post('/api/addtrip', async (req, res) => {
  const { userId, title, description, startDate, endDate, locations } = req.body;
  const newTrip = { userId, title, description, startDate, endDate, locations };

  try {
    const db = client.db('JourneyJournal');
    const result = await db.collection('Trips').insertOne(newTrip);
    res.status(201).json(result.ops[0]);
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Delete Trip endpoint
app.delete('/api/deletetrip/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const db = client.db('JourneyJournal');
    await db.collection('Trips').deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ message: 'Trip deleted' });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { login, password, firstName, lastName } = req.body;
  const newUser = { login, password, firstName, lastName };

  try {
    const db = client.db('JourneyJournal');
    const result = await db.collection('Users').insertOne(newUser);
    res.status(201).json(result.ops[0]);
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Search Trip endpoint
app.post('/api/searchtrips', async (req, res) => {
  const { search } = req.body;

  try {
    const db = client.db('JourneyJournal');
    const results = await db.collection('Trips').find({ title: { $regex: search, $options: 'i' } }).toArray();
    res.status(200).json(results);
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { login, password } = req.body;

  try {
    const db = client.db('JourneyJournal');
    const user = await db.collection('Users').findOne({ login, password });
    if (user) {
      res.status(200).json({ id: user._id, firstName: user.firstName, lastName: user.lastName });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
