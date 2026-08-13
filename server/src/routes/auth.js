const express = require('express');
const router = express.Router();
const {
  authAdmin,
  logoutAdmin,
  getAdminProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', authAdmin);
router.post('/logout', protect, logoutAdmin);
router.get('/me', protect, getAdminProfile);

module.exports = router;
