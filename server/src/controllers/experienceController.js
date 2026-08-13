const Experience = require('../models/Experience');

// @desc    Get all experience entries
// @route   GET /api/experience
// @access  Public
const getExperiences = async (req, res, next) => {
  try {
    const experiences = await Experience.find({}).sort({ startDate: -1 }); // Newest first
    res.json(experiences);
  } catch (error) {
    next(error);
  }
};

// @desc    Create an experience entry
// @route   POST /api/experience
// @access  Private
const createExperience = async (req, res, next) => {
  try {
    const experience = new Experience(req.body);
    const createdExperience = await experience.save();
    res.status(201).json(createdExperience);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an experience entry
// @route   PUT /api/experience/:id
// @access  Private
const updateExperience = async (req, res, next) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (experience) {
      Object.assign(experience, req.body);
      const updatedExperience = await experience.save();
      res.json(updatedExperience);
    } else {
      res.status(404);
      throw new Error('Experience not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an experience entry
// @route   DELETE /api/experience/:id
// @access  Private
const deleteExperience = async (req, res, next) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (experience) {
      await experience.deleteOne();
      res.json({ message: 'Experience removed' });
    } else {
      res.status(404);
      throw new Error('Experience not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
};
