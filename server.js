const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes.js');
const entryRoutes = require('./routes/entryRoutes.js');
const PORT = process.env.PORT || 5001;

// Middleware setup
const app = express();
app.set('port', PORT);
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? 'https://journey-journal-cop4331-71e6a1fdae61.herokuapp.com/' : 'http://localhost:3000',
  credentials: true, // Allow cookies to be sent
};

// CORS setup
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser()); 

// Connect to MongoDB
const url = process.env.MONGODB_URI;
mongoose.connect(url)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(err => {
  console.error('Failed to connect to MongoDB', err);
  process.exit(1);
});

app.use('/api/auth', authRoutes);
app.use('/api', entryRoutes);

// /* 
// Add entry endpoint 
// Request body
// {
//   userId: _id
//   title: String
//   description: String
//   location: String
// }
// Response
// {
//   _id: new id
// }
// */
// app.post('/api/addEntry', async (req, res) => {
//   const { userId, title, description, location } = req.body;
//   const newTrip = { userId, title, description, location };

//   try {
//     const db = mongoose.connection;
//     const result = await db.collection('journalEntry').insertOne(newTrip);
//     res.status(200).json({ _id: result.insertedId });
//   } catch (e) {
//     res.status(500).json({ error: e.toString() });
//   }
// });

// /* 
// Delete entry endpoint 
// example DEL URL: http://localhost:5001/api/deleteEntry/66798781672b94aba8e51609
// Request body
// {
//   N/A
// }
// Response
// simple message
// */
// app.delete('/api/deleteEntry/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     const db = mongoose.connection;
//     const result = await db.collection('journalEntry').deleteOne({ _id: new mongoose.Types.ObjectId(id) });
//     if (result.deletedCount > 0) {
//       res.status(200).send('Entry deleted successfully');
//     } else {
//       res.status(404).send('Entry not found');
//     }
//   } catch (e) {
//     res.status(500).json({ error: e.toString() });
//   }
// });

// /* 
// Edit entry endpoint 
// example PUT URL: http://localhost:5001/api/editEntry/66798781672b94aba8e51609
// Request body
// {
//   any info to update
// }
// Response
// {
//   updated entry
// }
// */
// app.put('/api/editEntry/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const db = mongoose.connection;

//     const filter = { _id: new mongoose.Types.ObjectId(id) };
//     const update = { $set: req.body };

//     const result = await db.collection('journalEntry').findOneAndUpdate(filter, update);
//     if (!result) {
//       return res.status(404).send('Entry not found');
//     }

//     const newResult = await db.collection('journalEntry').findOne({ _id: new mongoose.Types.ObjectId(id) });

//     res.status(200).json(newResult);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// /* 
// Search all entries endpoint 
// Request
// search: String
// Response
// results[]
// */
// app.post('/api/searchEntries', async (req, res) => {
//   const { search } = req.body;

//   try {
//     const db = mongoose.connection;
//     const results = await db.collection('journalEntry').find(
//       { title: { $regex: search, $options: 'i' } }).toArray();
//     res.status(200).json(results);
//   } catch (e) {
//     res.status(500).json({ error: e.toString() });
//   }
// });

// /* 
// Search entries for a specific userId endpoint 
// Request
// {
//   search: String
//   userId: _id
// }
// Response
// results[]
// */
// app.post('/api/searchMyEntries', async (req, res) => {
//   const { search, userId } = req.body;

//   try {
//     const db = mongoose.connection;
//     const results = await db.collection('journalEntry').find({
//       $or:
//         [
//           { title: { $regex: search, $options: 'i' } },
//           { description: { $regex: search, $options: 'i' } },
//           { location: { $regex: search, $options: 'i' } }
//         ],
//       userId: userId
//     }).toArray();

//     res.status(200).json(results);
//   } catch (e) {
//     res.status(500).json({ error: e.toString() });
//   }
// });

// /* 
// Get entry by ID endpoint 
// Request
// {id: entryId}
// Response
// {entry}
// */
// app.get('/api/getEntry/:id', async (req, res) => {
//   try {
//     console.log(`Received request for trip with id: ${req.params.id}`);
//     const db = mongoose.connection;
//     const entry = await db.collection('journalEntry').findOne({ _id: new mongoose.Types.ObjectId(req.params.id) });

//     if (!entry) {
//       res.status(404).json({ error: 'Entry not found' });
//     } else {
//       res.status(200).json(entry);
//     }
//   } catch (e) {
//     res.status(500).json({ error: e.toString() });
//   }
// });

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'frontend/build')));

// Serve the index.html file on all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
