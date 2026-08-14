const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const envEmail = process.env.ADMIN_EMAIL;
    const envPassword = process.env.ADMIN_PASSWORD;

    if (!envEmail || !envPassword) {
      res.status(500);
      throw new Error('Admin credentials are not configured in the server environment.');
    }

    if (email === envEmail && password === envPassword) {
      // Use a static ID since we don't have a database document
      const adminId = 'admin_env_user';
      const token = generateToken(adminId);
      
      // Set JWT as HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.json({
        _id: adminId,
        name: 'Admin User',
        email: envEmail,
        token: token // Returning for potential client-side fallback, but cookie is preferred
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logoutAdmin = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get admin profile
// @route   GET /api/auth/me
// @access  Private
const getAdminProfile = async (req, res, next) => {
  try {
    const envEmail = process.env.ADMIN_EMAIL;
    
    if (envEmail) {
      res.json({
        _id: 'admin_env_user',
        name: 'Admin User',
        email: envEmail,
      });
    } else {
      res.status(404);
      throw new Error('Admin not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = async (req, res, next) => {
  res.status(400);
  next(new Error('Password reset is disabled. Please update the ADMIN_PASSWORD in your .env file or Render environment variables.'));
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
const resetPassword = async (req, res, next) => {
  res.status(400);
  next(new Error('Password reset is disabled. Please update the ADMIN_PASSWORD in your .env file or Render environment variables.'));
};

// @desc    Update password from dashboard
// @route   PUT /api/auth/updatepassword
// @access  Private
const updatePassword = async (req, res, next) => {
  res.status(400);
  next(new Error('Password change is disabled. Please update the ADMIN_PASSWORD in your .env file or Render environment variables.'));
};

module.exports = {
  authAdmin,
  logoutAdmin,
  getAdminProfile,
  forgotPassword,
  resetPassword,
  updatePassword,
};
