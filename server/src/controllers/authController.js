const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

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

    const admin = await Admin.findOne({ email });

    if (admin && (await admin.comparePassword(password))) {
      const token = generateToken(admin._id);
      
      // Set JWT as HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
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
    const admin = await Admin.findById(req.admin._id);

    if (admin) {
      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
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
  try {
    const admin = await Admin.findOne({ email: req.body.email });

    if (!admin) {
      res.status(404);
      throw new Error('There is no user with that email');
    }

    // Get reset token
    const resetToken = admin.getResetPasswordToken();

    await admin.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/admin/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: admin.email,
        subject: 'Password reset token',
        message,
      });

      res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
      console.log(err);
      admin.resetPasswordToken = undefined;
      admin.resetPasswordExpire = undefined;

      await admin.save({ validateBeforeSave: false });

      res.status(500);
      throw new Error('Email could not be sent');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const admin = await Admin.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!admin) {
      res.status(400);
      throw new Error('Invalid token');
    }

    // Set new password (we hash it here because schema might not have pre-save hook for password in this codebase based on what I saw)
    const salt = await bcrypt.genSalt(10);
    admin.passwordHash = await bcrypt.hash(req.body.password, salt);

    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password from dashboard
// @route   PUT /api/auth/updatepassword
// @access  Private
const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // We need to fetch the admin by ID and explicitly select the passwordHash if it wasn't already included
    // Wait, Admin.findById gets everything by default in this schema since passwordHash doesn't have select: false
    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      res.status(404);
      throw new Error('Admin not found');
    }

    // Check if current password is correct
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(400);
      throw new Error('Current password is incorrect');
    }

    // Hash and set new password
    const salt = await bcrypt.genSalt(10);
    admin.passwordHash = await bcrypt.hash(newPassword, salt);

    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authAdmin,
  logoutAdmin,
  getAdminProfile,
  forgotPassword,
  resetPassword,
  updatePassword,
};
