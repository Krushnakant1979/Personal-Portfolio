const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  fullDescription: {
    type: String,
    required: true,
  },
  technologies: [{
    type: String,
  }],
  category: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    required: true,
  },
  screenshots: [{
    type: String,
  }],
  githubUrl: {
    type: String,
  },
  liveUrl: {
    type: String,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
  challenges: {
    type: String,
  },
  outcome: {
    type: String,
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published'
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
