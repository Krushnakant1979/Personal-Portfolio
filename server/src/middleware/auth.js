const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Since we use .env for auth, if the token is valid, they are the admin.
      req.admin = {
        _id: decoded.id,
        email: process.env.ADMIN_EMAIL
      };
      
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
