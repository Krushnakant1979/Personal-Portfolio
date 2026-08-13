const Skill = require('../models/Skill');

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
const getSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find({}).sort({ displayOrder: 1, createdAt: 1 });
    res.json(skills);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a skill category
// @route   POST /api/skills
// @access  Private
const createSkill = async (req, res, next) => {
  try {
    const skill = new Skill(req.body);
    const createdSkill = await skill.save();
    res.status(201).json(createdSkill);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a skill category
// @route   PUT /api/skills/:id
// @access  Private
const updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (skill) {
      Object.assign(skill, req.body);
      const updatedSkill = await skill.save();
      res.json(updatedSkill);
    } else {
      res.status(404);
      throw new Error('Skill not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a skill category
// @route   DELETE /api/skills/:id
// @access  Private
const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (skill) {
      await skill.deleteOne();
      res.json({ message: 'Skill removed' });
    } else {
      res.status(404);
      throw new Error('Skill not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
};
