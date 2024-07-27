const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;
app.use(cors());
app.use(bodyParser.json());

const url = process.env.MONGODB_URI;
const client = new MongoClient(url);
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
    pass: process.env.EMAIL_PASSWORD,
  },
});

app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const db = client.db('journeyJournal');
    const user = await db.collection('user').findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit code
    await db.collection('user').updateOne(
      { email },
      { $set: { resetPasswordCode: resetCode, resetPasswordExpires: Date.now() + 3600000 } } // Code expires in 1 hour
    );

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'JourneyJournal Password Reset Code',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Your password reset code is: ${resetCode}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);

        return res.status(500).json({ error: 'Error sending email', details: error.toString() });
      } else {
        console.log('Password reset email sent:', info.response);
        res.status(200).json({ message: 'Password reset code sent to email' });
      }
    });
  } catch (e) {
    console.error('Error in forgot-password endpoint:', e);
    res.status(500).json({ error: e.toString() });
  }
});

app.post('/api/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    const db = client.db('journeyJournal');
    const user = await db.collection('user').findOne({
      email,
      resetPasswordCode: code,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid code or code has expired' });
    }

    await db.collection('user').updateOne(
      { email },
      {
        $set: { password: newPassword },
        $unset: { resetPasswordCode: "", resetPasswordExpires: "" }
      }
    );

    res.status(200).json({ message: 'Password reset successful' });
  } catch (e) {
    console.error('Error in reset-password endpoint:', e);
    res.status(500).json({ error: e.toString() });
  }
});
