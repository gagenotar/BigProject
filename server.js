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



// // New code
// app.post('/api/forgot-password', async (req, res) => {
//   const { email } = req.body;

//   try {
//     const db = client.db('journeyJournal');
//     const user = await db.collection('user').findOne({ email });
//     if (!user) {
//       return res.status(400).json({ error: 'User not found' });
//     }

//     const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit code
//     await db.collection('user').updateOne(
//       { email },
//       { $set: { resetPasswordCode: resetCode, resetPasswordExpires: Date.now() + 3600000 } } // Code expires in 1 hour
//     );

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'JourneyJournal Password Reset Code',
//       text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
//         Your password reset code is: ${resetCode}\n\n
//         If you did not request this, please ignore this email and your password will remain unchanged.\n`,
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error('Error sending email:', error);

//         return res.status(500).json({ error: 'Error sending email', details: error.toString() });
//       } else {
//         console.log('Password reset email sent:', info.response);
//         res.status(200).json({ message: 'Password reset code sent to email' });
//       }
//     });
//   } catch (e) {
//     console.error('Error in forgot-password endpoint:', e);
//     res.status(500).json({ error: e.toString() });
//   }
// });

// app.post('/api/reset-password', async (req, res) => {
//   const { email, code, newPassword } = req.body;

//   try {
//     const db = client.db('journeyJournal');
//     const user = await db.collection('user').findOne({
//       email,
//       resetPasswordCode: code,
//       resetPasswordExpires: { $gt: Date.now() }
//     });

//     if (!user) {
//       return res.status(400).json({ message: 'Invalid code or code has expired' });
//     }

//     await db.collection('user').updateOne(
//       { email },
//       {
//         $set: { password: newPassword },
//         $unset: { resetPasswordCode: "", resetPasswordExpires: "" }
//       }
//     );

//     res.status(200).json({ message: 'Password reset successful' });
//   } catch (e) {
//     console.error('Error in reset-password endpoint:', e);
//     res.status(500).json({ error: e.toString() });
//   }
// });