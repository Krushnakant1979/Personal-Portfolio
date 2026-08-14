const path = require('path');
const express = require('express');
const router = express.Router();
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { protect } = require('../middleware/auth');

// Configure Multer + Cloudinary Storage for images
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'portfolio',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif', 'pdf'],
    resource_type: 'auto',
  },
});
const upload = multer({ storage: cloudinaryStorage });

// @route   POST /api/upload
// @desc    Upload an image to Cloudinary
// @access  Private/Admin
router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }
  res.json({ url: req.file.path });
});

// @route   POST /api/upload/resume
// @desc    Upload resume PDF to Cloudinary
// @access  Private/Admin
router.post('/resume', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Cloudinary returns the secure URL in req.file.path
  res.json({ url: req.file.path });
});

module.exports = router;
