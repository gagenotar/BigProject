// routes/tripRoutes.js
const express = require('express');
const Trip = require('../models/Trip'); // Ensure this path is correct
const router = express.Router();

// Create a new trip
router.post('/createEntry', async (req, res) => {
  try {
    const { title, location, rating, description, image } = req.body;

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
});

module.exports = router;
