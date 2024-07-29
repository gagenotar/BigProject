const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User.js');
const { generateTokens } = require('../utils/tokenUtils.js');

exports.login = (login, password) => {
  return new Promise(async (resolve, reject) => {
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
        return reject(new Error('Invalid email or username'));
      }

      if (!foundUser.isVerified) {
        return reject(new Error('Email not verified. Please check your email for the verification code.'));
      }

      const isMatch = await bcrypt.compare(password, foundUser.password);
      if (!isMatch) {
        return reject(new Error('Invalid password'));
      }

      const { accessToken, refreshToken } = generateTokens(foundUser);
      
      return resolve({ accessToken, refreshToken, id: foundUser._id });
    } catch (error) {
      console.error('Login error:', error);
      return reject(new Error('Server error'));
    }
  });
};
