const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['work', 'education'],
      required: true,
      default: 'work',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    period: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    skills: [{
      type: String,
      trim: true
    }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Experience', experienceSchema);
