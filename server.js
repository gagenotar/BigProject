const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes.js');
const appRoutes = require('./routes/entryAppRoutes.js');
const entryRoutes = require('./routes/entryRoutes.js');
const PORT = process.env.PORT || 5001;

// Middleware setup
const app = express();
app.set('port', PORT);
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? 'https://journey-journal-cop4331-71e6a1fdae61.herokuapp.com' : 'http://localhost:3000',
  credentials: true, // Allow cookies to be sent
};

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

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
app.use('/api/app', appRoutes);
app.use('/api', entryRoutes);

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