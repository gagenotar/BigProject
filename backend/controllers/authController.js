const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateTokens } = require('../utils/tokenUtils');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const { accessToken, refreshToken } = generateTokens(user);
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.register = async (req, res) => {
  const { firstName, lastName, email, login, password } = req.body;
  const newUser = new User({ firstName, lastName, email, login, password });

  try {
    const result = await newUser.save();
    const { accessToken, refreshToken } = generateTokens(result);
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
    res.status(201).json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* 
Login endpoint 

Request
{
  email: String
  password: String
}
Response
{
  id: _id
  login: String
  firstName: String
  lastName: String
}
*/
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const db = client.db('journeyJournal');
      const user = await db.collection('user').findOne({ email, password });
      if (user) {
        res.status(200).json({ id: user._id, login: user.login, firstName: user.firstName, lastName: user.lastName });
      } else {
        res.status(404).json({ error: 'Invalid credentials' });
      }
    } catch (e) {
      res.status(500).json({ error: e.toString() });
    }
  });
  
  /* 
  Register endpoint 
  
  Request body
  {
    firstName: String
    lastName: String
    email: String
    login: String
    password: String
  }
  
  Response
  {
    id: new id
    login: username
  }
  */
  app.post('/api/register', async (req, res) => {
    const { firstName, lastName, email, login, password } = req.body;
    const newUser = { firstName, lastName, email, login, password};
  
    try {
      const db = client.db('journeyJournal');
      const result = await db.collection('user').insertOne(newUser);
      res.status(200).json({id: result.insertedId, login: login});
    } catch (e) {
      res.status(500).json({ error: e.toString() });
    }
  });