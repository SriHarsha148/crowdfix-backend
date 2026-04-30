const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {

  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // No token = blocked
  if (!token) {
    return res.status(401).json({ error: 'No token. Access denied.' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is invalid.' });
  }
};