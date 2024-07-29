const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const User = require('../models/User.js');
const { generateTokens } = require('../utils/tokenUtils.js');

exports.login = async (req, res) => {
  const { login, password } = req.body;

  try {
    // Find a user that has either that email or login
    const foundUser = await User.findOne(
      { 
        $or: [
          { email: login },
          { login: login }
        ]
      }
    );
    if (!foundUser) {
      return res.status(401).json({ message: 'Invalid email or username' });
    }

    if (!foundUser.isVerified) {
      return res.status(402).json({ message: 'Email not verified. Please check your email for the verification code.' });
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(403).json({ message: 'Invalid password' });
    }

    const { accessToken, refreshToken } = generateTokens(foundUser);

    // Set the refresh token in the cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // accessible only by web server
      secure: true, // https only in production
      sameSite: 'Lax', // cross-site cookies
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send access token in the response body
    res.json({ accessToken, id: foundUser._id });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.register = async (req, res) => {
  const { firstName, lastName, email, login, password } = req.body;

  try {
    // Check if email is unique
    let foundUser = await User.findOne({ email });
    if (foundUser) {
      return res.status(400).json({ message: 'Email must be unique' });
    }
    
    // Check if login is unique
    foundUser = await User.findOne({ login });
    if (foundUser) {
      return res.status(400).json({ message: 'Login must be unique' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new User({ 
      firstName, 
      lastName, 
      email, 
      login, 
      password: hashedPassword, 
      verificationCode 
    });
    const result = await newUser.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'JourneyJournal Email Verification',
      text: `Your verification code is: ${verificationCode}`
    };

    // Send email and await its completion
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(result);

    // Set the refresh token in the cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // accessible only by web server
      secure: true, // https only in production
      sameSite: 'Lax', // cross-site cookies
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send access token in the response body
    res.status(200).json({ accessToken, id: result._id, email: email, message: 'Verification code sent to email' });

  } catch (error) {
    console.error('Registration error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
};

exports.verifyCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: 'Invalid email' });
      
    if (user.verificationCode !== code) 
      return res.status(400).json({ message: 'Invalid code' });

    user.isVerified = true;
    user.verificationCode = null;
    await User.updateOne(
      { email },
      { $set: { isVerified: true, verificationCode: null } }
    );

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
}

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit code
    await User.updateOne(
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

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

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
}

exports.resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    const user = await User.findOne({
      email,
      resetPasswordCode: code,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid code or code has expired' });
    }

    await User.updateOne(
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
}

exports.refreshToken = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.refreshToken) return res.status(403).json({ message: 'No refresh token found', cookies });

  const refreshToken = cookies.refreshToken;
  console.log('REFRESH TOKEN: ', refreshToken);

  jwt.verify(
    refreshToken, 
    process.env.REFRESH_TOKEN_SECRET, 
    async (err, decoded) => {
      if (err) return res.status(401).json({ message: 'Invalid refresh token' });

      const foundUser = await User.findOne({ _id: decoded.userId, login: decoded.login });
      if (!foundUser) return res.status(403).json({ message: 'Unauthorized' });

      const accessToken = jwt.sign(
        { _id: foundUser._id, login: foundUser.login },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1m' }
      );

      res.json({ accessToken });
    }
  );
};

exports.logout = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.refreshToken) return res.status(204).json({ message: 'No content' });

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    path: '/'
  });

  res.json({ message: 'Cookie cleared' });
};