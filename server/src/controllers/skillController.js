const { db, FieldValue } = require('../config/db');

// Helper to format Firestore docs
const formatDoc = (doc) => ({ _id: doc.id, ...doc.data() });

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
const getSkills = async (req, res, next) => {
  try {
    const snapshot = await db.collection('skills').get();
    let skills = [];
    snapshot.forEach(doc => {
      skills.push(formatDoc(doc));
    });
    
    // Sort by displayOrder ascending, then createdAt ascending
    skills.sort((a, b) => {
      if (a.displayOrder !== b.displayOrder) {
        return (a.displayOrder || 0) - (b.displayOrder || 0);
      }
      const timeA = a.createdAt ? (a.createdAt.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt).getTime()) : 0;
      const timeB = b.createdAt ? (b.createdAt.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt).getTime()) : 0;
      return timeA - timeB;
    });

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
    const newSkill = {
      ...req.body,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };
    
    const docRef = await db.collection('skills').add(newSkill);
    const doc = await docRef.get();
    
    res.status(201).json(formatDoc(doc));
  } catch (error) {
    next(error);
  }
};

// @desc    Update a skill category
// @route   PUT /api/skills/:id
// @access  Private
const updateSkill = async (req, res, next) => {
  try {
    const docRef = db.collection('skills').doc(req.params.id);
    const doc = await docRef.get();
    
    if (doc.exists) {
      const updates = {
        ...req.body,
        updatedAt: FieldValue.serverTimestamp()
      };
      delete updates._id;
      
      await docRef.update(updates);
      const updatedDoc = await docRef.get();
      res.json(formatDoc(updatedDoc));
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
    const docRef = db.collection('skills').doc(req.params.id);
    const doc = await docRef.get();
    
    if (doc.exists) {
      await docRef.delete();
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
