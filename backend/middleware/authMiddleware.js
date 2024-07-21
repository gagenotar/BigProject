const jwt = require('jsonwebtoken');

const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(403).json({ message: 'Token is required' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Token is required' });

  jwt.verify(token, 'access-secret-key', (err, user) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

module.exports = verifyAccessToken;