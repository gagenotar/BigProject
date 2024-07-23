const journalEntry = require('../models/JournalEntry.js');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb')

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
  const { userId, title, description, location, rating, image} = req.body;
  const newTrip = new journalEntry({ userId, title, description, location, rating, image});

  try {
    const db = client.db('journeyJournal');
    const result = await db.collection('journalEntry').insertOne(newTrip);
    res.status(200).json({ _id: result.insertedId });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }  
}

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
    const { id } = req.params;
    const db = mongoose.connection;

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
}

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
    console.log(`Received request for trip with id: ${id}`);
    const db = mongoose.connection;
    const entry = await db.collection('journalEntry').findOne({ _id: id });

    if (!entry) {
      res.status(404).json({ error: 'Entry not found' });
    } else {
      res.status(200).json(entry);
    }
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
    const results = await db.collection('journalEntry').find({
      $or:
        [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } }
        ]
    }).toArray();

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
    const results = await db.collection('journalEntry').find({
      $or:
        [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } }
        ],
      userId: userId
    }).toArray();

    res.status(200).json(results);
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
}