const journalEntry = require('../models/JournalEntry.js');
const Trip = require('../models/Trip'); 
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const path = require('path');

/* 
Add entry endpoint 
Request body
{
  userId: _id
  title: String
  description: String
  location: String
}
Response
{
  _id: new id
}
*/
exports.addEntry = async (req, res) => {
  const { userId, title, description } = req.body;
  const location = JSON.parse(req.body.location); // Parse the location field back into an object
  const rating = parseInt(req.body.rating, 10); // Ensure rating is an integer
  const date = new Date(); // Add the current date

  const relativeImagePath = req.file ? path.join('uploads', req.file.filename).replace(/\\/g, '/') : null;

  const newTrip = { 
    userId: new ObjectId(userId), 
    title, 
    description, 
    location, 
    rating, 
    image: relativeImagePath,
    date
  };

  try {
    const db = mongoose.connection;
    const result = await db.collection('journalEntry').insertOne(newTrip);
    res.status(200).json({ _id: result.insertedId });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }  
};


/* 
Delete entry endpoint 
example DEL URL: http://localhost:5001/api/deleteEntry/66798781672b94aba8e51609
Request body
{
  N/A
}
Response
simple message
*/
exports.deleteEntryByID = async (req, res) => {
  const { id } = req.params;

  try {
    const db = mongoose.connection;
    const result = await db.collection('journalEntry').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount > 0) {
      res.status(200).send('Entry deleted successfully');
    } else {
      res.status(404).send('Entry not found');
    }
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }  
}

/* 
Edit entry endpoint 
example PUT URL: http://localhost:5001/api/editEntry/66798781672b94aba8e51609
Request body
{
  any info to update
}
Response
{
  updated entry
}
*/
exports.editEntryByID = async (req, res) => {
  try {
    const id = req.params.id;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const db = mongoose.connection;

    // Debug logging to check incoming request body and file
    console.log('Request Body:', req.body);
    console.log('Request File:', req.file);

    // Initialize update object
    const update = {};

    // Conditionally add fields to the update object if they are provided
    if (req.body.title) {
      update.title = req.body.title;
    }

    if (req.body.description) {
      update.description = req.body.description;
    }

    if (req.body.location) {
      update.location = JSON.parse(req.body.location);
    }

    if (req.body.rating) {
      update.rating = parseInt(req.body.rating, 10);
    }

    if (req.file) {
      update.image = path.join('uploads', req.file.filename).replace(/\\/g, '/');
    }

    const filter = { _id: new ObjectId(id) };
    const updateDoc = { $set: update };

    // Log the filter and updateDoc to verify correct values
    console.log('Filter:', filter);
    console.log('Update Document:', updateDoc);

    const result = await db.collection('journalEntry').findOneAndUpdate(filter, updateDoc, { returnOriginal: false });

    // Check if the document was found and updated
    if (!result.value) {
      return res.status(404).send('Entry not found');
    }

    // Fetch the updated entry
    const newResult = await db.collection('journalEntry').findOne({ _id: new ObjectId(id) });

    res.status(200).json(newResult);
  } catch (error) {
    // Log the error for debugging
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};


/* 
Get entry by ID endpoint 
Request
{id: entryId}
Response
{entry}
*/
exports.getEntryByID = async (req, res) => {
  try {
    let id = new ObjectId(req.params.id)
    const db = mongoose.connection;

    // Fetch the entry
    const entry = await db.collection('journalEntry').findOne({ _id: id });
    console.log('Fetched entry:', entry); // Log the fetched entry

    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    // Fetch the user
    const user = await db.collection('user').findOne({ _id: new ObjectId(entry.userId) });
    console.log('Fetched user:', user); // Log the fetched user

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Combine the entry with the username and send the response
    const response = { ...entry, username: user.login }; // 'login' field in the user collection
    console.log('Response:', response); // Log the response
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
}

/* 
Search all entries endpoint 
Request
search: String
Response
results[]
*/
exports.searchEntries = async (req, res) => {
  const { search, userId } = req.body;

  try {
    const db = mongoose.connection;
    const query = { 
      ...(search ? { title: { $regex: search, $options: 'i' } } : {}), ...(userId ? { userId: new ObjectId(userId) } : {}) };
    const results = await db.collection('journalEntry').aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'user',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          location: 1,
          image: 1,
          date: 1,
          rating: 1,
          username: '$userDetails.login',
          userPicture: '$userDetails.pfp'
        }
      },
      { $sort: { date: -1 } } // Sort by date in descending order
    ]).toArray();
    res.status(200).json(results);
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
}

/* 
Search entries for a specific userId endpoint 
Request
{
  search: String
  userId: _id
}
Response
results[]
*/
exports.searchMyEntries = async (req, res) => {
  const { search, userId } = req.body;

  try {
    const db = mongoose.connection;
    const query = { 
      userId: new ObjectId(userId),
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.street': { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.state': { $regex: search, $options: 'i' } },
        { 'location.country': { $regex: search, $options: 'i' } }
      ]
    };

    const results = await db.collection('journalEntry').aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'user',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          location: 1,
          image: 1,
          date: 1,
          rating: 1,
          username: '$userDetails.login',
          userPicture: '$userDetails.pfp'
        }
      },
      { $sort: { date: -1 } } // Sort by date in descending order
    ]).toArray();

    res.status(200).json(results);
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
}

// Get profile endpoint
exports.profileByID = async (req, res) => {
  const { id } = req.params;

  try {
    const db = mongoose.connection;
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
}

// Update Profile Endpoint
exports.updateProfileByID = async (req, res) => {
  const { id } = req.params;
  const { login, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const db = mongoose.connection;
    const result = await db.collection('user').updateOne(
      { _id: new ObjectId(id) },
      { $set: { login, password: hashedPassword } }
    );
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'Profile updated successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (e) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Create a new trip
exports.createEntry = async (req, res) => {
  const { title, location, rating, description, image } = req.body;

  try {
    const newTrip = new Trip({
      title,
      location,
      rating,
      description,
      image,
    });

    await newTrip.save();
    res.status(201).json({ message: 'Trip created successfully', trip: newTrip });
  } catch (error) {
    res.status(500).json({ message: 'Error creating trip', error });
  }  
}