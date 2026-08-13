const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  github: {
    type: String,
    trim: true,
  },
  linkedin: {
    type: String,
    trim: true,
  },
  instagram: {
    type: String,
    trim: true,
  },
  resume: {
    type: String,
    trim: true,
  },
  about: {
    type: String,
    trim: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Profile', ProfileSchema);
