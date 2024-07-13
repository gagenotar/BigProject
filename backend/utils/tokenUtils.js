const jwt = require('jsonwebtoken');

const generateTokens = (user) => {
  const accessToken = jwt.sign({ userId: user._id }, 'access-secret-key', { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId: user._id }, 'refresh-secret-key', { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

module.exports = { generateTokens };
