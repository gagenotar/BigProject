const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const { generateTokens } = require('../utils/tokenUtils.js');
const mongoose = require('mongoose');

// TODO: Use bcrypt for password encryption/decryption

// Connect to MongoDB
const url = process.env.MONGODB_URI;
mongoose.connect(url)

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const db = mongoose.connection;
    const user = await User.findOne({ email, password });
    if (!user) 
      return res.status(401).json({ message: 'Unauthorized' });

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie('refreshToken', refreshToken, 
      { 
        httpOnly: true, // accessible only by web server
        secure: true, // https
        sameSite: 'None', // corss-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

    // Send access token containing userId
    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.register = async (req, res) => {
  const { firstName, lastName, email, login, password } = req.body;
  const newUser = new User({ firstName, lastName, email, login, password });

  try {
    const db = mongoose.connection;
    const result = await User.insertOne(newUser);

    const { accessToken, refreshToken } = generateTokens(result);

    res.cookie('refreshToken', refreshToken, 
      { 
        httpOnly: true, 
        secure: true, 
        sameSite: 'Strict' 
      });
      
    // Send access token containing userId
    res.status(201).json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(403).json({ message: 'Refresh token is required' });

  jwt.verify(
    refreshToken, 
    process.env.REFRESH_TOKEN_SECRET, 
    async (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid refresh token' });

    const foundUser = await User.findOne(
      { 
        _id: decoded.userId,
        login: decoded.login
       });
    const user = { id: decoded.userId };

    const accessToken = jwt.sign(
      { 
        _id: decoded.userId,
        login: decoded.login
       }, 
       process.env.ACCESS_TOKEN_SECRET, 
       { expiresIn: '15m' }
      );

    res.json({ accessToken });
  });
};

exports.logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(204); // No content
  res.clearCookie('refreshToken', 
    { 
      httpOnly: true, 
      secure: true, 
      sameSite: 'Strict' 
    });
    
    res.json({'message' : 'Cookie cleared'});
};

// /* 
// Login endpoint 

// Request
// {
//   email: String
//   password: String
// }
// Response
// {
//   id: _id
//   login: String
//   firstName: String
//   lastName: String
// }
// */
// app.post('/api/login', async (req, res) => {
//     const { email, password } = req.body;
  
//     try {
//       const db = client.db('journeyJournal');
//       const user = await db.collection('user').findOne({ email, password });
//       if (user) {
//         res.status(200).json({ id: user._id, login: user.login, firstName: user.firstName, lastName: user.lastName });
//       } else {
//         res.status(404).json({ error: 'Invalid credentials' });
//       }
//     } catch (e) {
//       res.status(500).json({ error: e.toString() });
//     }
//   });
  
//   /* 
//   Register endpoint 
  
//   Request body
//   {
//     firstName: String
//     lastName: String
//     email: String
//     login: String
//     password: String
//   }
  
//   Response
//   {
//     id: new id
//     login: username
//   }
//   */
//   app.post('/api/register', async (req, res) => {
//     const { firstName, lastName, email, login, password } = req.body;
//     const newUser = { firstName, lastName, email, login, password};
  
//     try {
//       const db = client.db('journeyJournal');
//       const result = await db.collection('user').insertOne(newUser);
//       res.status(200).json({id: result.insertedId, login: login});
//     } catch (e) {
//       res.status(500).json({ error: e.toString() });
//     }
//   });