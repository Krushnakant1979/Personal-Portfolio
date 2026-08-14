const { db, FieldValue } = require('../config/db');

// Helper to format Firestore docs
const formatDoc = (doc) => ({ _id: doc.id, ...doc.data() });

// @desc    Get all experience entries
// @route   GET /api/experience
// @access  Public
const getExperiences = async (req, res, next) => {
  try {
    const snapshot = await db.collection('experiences').get();
    let experiences = [];
    snapshot.forEach(doc => {
      experiences.push(formatDoc(doc));
    });
    
    // Sort by startDate descending (Newest first)
    experiences.sort((a, b) => {
      const timeA = a.startDate ? new Date(a.startDate).getTime() : 0;
      const timeB = b.startDate ? new Date(b.startDate).getTime() : 0;
      return timeB - timeA;
    });

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
    const newExperience = {
      ...req.body,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };
    
    const docRef = await db.collection('experiences').add(newExperience);
    const doc = await docRef.get();
    
    res.status(201).json(formatDoc(doc));
  } catch (error) {
    next(error);
  }
};

// @desc    Update an experience entry
// @route   PUT /api/experience/:id
// @access  Private
const updateExperience = async (req, res, next) => {
  try {
    const docRef = db.collection('experiences').doc(req.params.id);
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
    const docRef = db.collection('experiences').doc(req.params.id);
    const doc = await docRef.get();
    
    if (doc.exists) {
      await docRef.delete();
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
