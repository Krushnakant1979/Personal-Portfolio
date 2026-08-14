const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { db } = require('../config/db');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Helper function to compare password since we don't have mongoose methods
const comparePassword = async (enteredPassword, passwordHash) => {
  return await bcrypt.compare(enteredPassword, passwordHash);
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const adminsRef = db.collection('admins');
    const snapshot = await adminsRef.where('email', '==', email).limit(1).get();

    if (snapshot.empty) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    let adminDoc = null;
    let adminData = null;
    snapshot.forEach(doc => {
      adminDoc = doc;
      adminData = doc.data();
    });

    if (adminData && (await comparePassword(password, adminData.passwordHash))) {
      const token = generateToken(adminDoc.id);
      
      // Set JWT as HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.json({
        _id: adminDoc.id,
        name: adminData.name,
        email: adminData.email,
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
    const adminDoc = await db.collection('admins').doc(req.admin._id).get();

    if (adminDoc.exists) {
      const adminData = adminDoc.data();
      res.json({
        _id: adminDoc.id,
        name: adminData.name,
        email: adminData.email,
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
    const adminsRef = db.collection('admins');
    const snapshot = await adminsRef.where('email', '==', req.body.email).limit(1).get();

    if (snapshot.empty) {
      res.status(404);
      throw new Error('There is no user with that email');
    }

    let adminDoc = null;
    let adminData = null;
    snapshot.forEach(doc => {
      adminDoc = doc;
      adminData = doc.data();
    });

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    const resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins

    await adminDoc.ref.update({
      resetPasswordToken,
      resetPasswordExpire
    });

    // Create reset url
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/admin/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: adminData.email,
        subject: 'Password reset token',
        message,
      });

      res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
      console.log(err);
      await adminDoc.ref.update({
        resetPasswordToken: null,
        resetPasswordExpire: null
      });

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

    const adminsRef = db.collection('admins');
    const snapshot = await adminsRef
      .where('resetPasswordToken', '==', resetPasswordToken)
      .where('resetPasswordExpire', '>', Date.now())
      .limit(1)
      .get();

    if (snapshot.empty) {
      res.status(400);
      throw new Error('Invalid token');
    }

    let adminDoc = null;
    snapshot.forEach(doc => {
      adminDoc = doc;
    });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(req.body.password, salt);

    await adminDoc.ref.update({
      passwordHash,
      resetPasswordToken: null,
      resetPasswordExpire: null
    });

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

    const adminDoc = await db.collection('admins').doc(req.admin._id).get();

    if (!adminDoc.exists) {
      res.status(404);
      throw new Error('Admin not found');
    }

    const adminData = adminDoc.data();

    // Check if current password is correct
    const isMatch = await comparePassword(currentPassword, adminData.passwordHash);
    if (!isMatch) {
      res.status(400);
      throw new Error('Current password is incorrect');
    }

    // Hash and set new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await adminDoc.ref.update({
      passwordHash
    });

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
