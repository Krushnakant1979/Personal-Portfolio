const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = await Admin.findById(decoded.id).select('-passwordHash');
      return next();
    } catch (error) {
      res.status(401);
      return next(new Error('Not authorized, token failed'));
    }
  }

  // No token present
  res.status(401);
  return next(new Error('Not authorized, no token'));
};

module.exports = { protect };
