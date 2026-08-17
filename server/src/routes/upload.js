const path = require('path');
const express = require('express');
const router = express.Router();
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { protect } = require('../middleware/auth');

// Configure Multer + Cloudinary Storage
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (file.mimetype === 'application/pdf') {
      return {
        folder: 'portfolio',
        resource_type: 'raw', // Must be raw for documents
        public_id: `Krushnakant_Rutele_Resume_${Date.now()}.pdf`, // Explicitly add .pdf
      };
    }
    
    // For images
    return {
      folder: 'portfolio',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif'],
      resource_type: 'auto',
    };
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

  res.json({ url: req.file.path });
});

module.exports = router;
