const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const { generateTokens } = require('../utils/tokenUtils.js');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const { accessToken, refreshToken } = generateTokens(foundUser);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false, // Use true if using HTTPS
      sameSite: 'Lax',
      path: '/', 
      maxAge: 3 * 60 * 1000 // 3 minutes
    });
    // Set the refresh token in the cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // accessible only by web server
      secure: false, // https only in production
      sameSite: 'Lax', // cross-site cookies
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send access token in the response body
    res.json({ accessToken, id: foundUser._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.register = async (req, res) => {
  const { firstName, lastName, email, login, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ firstName, lastName, email, login, password: hashedPassword });
    const result = await newUser.save();

    const { accessToken, refreshToken } = generateTokens(result);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false, // Use true if using HTTPS
      sameSite: 'Lax',
      path: '/', 
      maxAge: 3 * 60 * 1000 // 3 minutes
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, // Use true if using HTTPS
      sameSite: 'Lax', // Consider 'Lax' if not cross-site
      path: '/', 
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Send access token containing userId
    res.status(201).json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.refreshToken = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.refreshToken) return res.status(403).json({ message: 'No refresh token found', cookies: cookies});

  const refreshToken = cookies.refreshToken
  console.log('REFRESH TOKEN: ', refreshToken)

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
       
    if (!foundUser) return res.status(403).json({ message: 'Unauthorized' });

    const accessToken = jwt.sign(
      { 
        _id: foundUser._id,
        login: foundUser.login
       }, 
       process.env.ACCESS_TOKEN_SECRET, 
       { expiresIn: '3m' }
      );
      
    res.json({ accessToken });
  });
};

exports.logout = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.refreshToken) return res.status(204).json({ message: 'No content' });

  res.clearCookie('refreshToken', 
    { 
      httpOnly: true, 
      secure: false, 
      sameSite: 'None',
      path: '/' 
    });

    res.json({'message' : 'Cookie cleared'});
};