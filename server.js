const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');
const crypto = require('crypto');
const transporter = require('./mailer');
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

// Generate a verification token
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Register endpoint
app.post('/api/register', async (req, res) => {
    const { login, password, firstName, lastName, email } = req.body; // Include email
    const verificationToken = generateToken();
    const newUser = { login, password, firstName, lastName, email, verified: false, verificationToken };
  
    try {
      const db = client.db('journeyJournal');
      const result = await db.collection('user').insertOne(newUser);
  
      const mailOptions = {
        from: process.env.EMAIL, // Sender's email address
        to: email, // Recipient's email address
        subject: 'Verify your email',
        text: `Please verify your email by clicking the following link: ${process.env.BASE_URL}/verify-email?token=${verificationToken}`
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          return res.status(500).json({ error: 'Error sending verification email' });
        }
        console.log('Email sent: ' + info.response);
        res.status(200).json({ _id: result.insertedId, login });
      });
    } catch (e) {
      console.error('Error during registration:', e);
      res.status(500).json({ error: e.toString() });
    }
  });
  

// Email verification endpoint
app.get('/api/verify-email', async (req, res) => {
  const { token } = req.query;

  try {
    const db = client.db('journeyJournal');
    const user = await db.collection('user').findOne({ verificationToken: token });

    if (!user) {
      return res.status(404).json({ error: 'Invalid verification token' });
    }

    await db.collection('user').updateOne({ _id: user._id }, { $set: { verified: true }, $unset: { verificationToken: "" } });
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
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
    res.status(500).json({ error: e.toString() });
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
