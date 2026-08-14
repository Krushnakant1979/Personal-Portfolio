const express = require('express');
const router = express.Router();
const {
  authAdmin,
  logoutAdmin,
  getAdminProfile,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', authAdmin);
router.post('/logout', protect, logoutAdmin);
router.get('/me', protect, getAdminProfile);
router.put('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;
