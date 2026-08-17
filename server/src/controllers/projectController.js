const { db, FieldValue } = require('../config/db');

// Helper to format Firestore docs
const formatDoc = (doc) => ({ _id: doc.id, ...doc.data() });

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res, next) => {
  try {
    const snapshot = await db.collection('projects').where('status', '!=', 'draft').get();
    let projects = [];
    snapshot.forEach(doc => {
      projects.push(formatDoc(doc));
    });
    
    // Sort by displayOrder ascending, then createdAt descending
    projects.sort((a, b) => {
      if (a.displayOrder !== b.displayOrder) {
        return (a.displayOrder || 0) - (b.displayOrder || 0);
      }
      const timeA = a.createdAt ? (a.createdAt.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt).getTime()) : 0;
      const timeB = b.createdAt ? (b.createdAt.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt).getTime()) : 0;
      return timeB - timeA;
    });

    res.json(projects);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects (admin only)
// @route   GET /api/projects/admin
// @access  Private
const getAdminProjects = async (req, res, next) => {
  try {
    const snapshot = await db.collection('projects').get();
    let projects = [];
    snapshot.forEach(doc => {
      projects.push(formatDoc(doc));
    });
    
    projects.sort((a, b) => {
      if (a.displayOrder !== b.displayOrder) {
        return (a.displayOrder || 0) - (b.displayOrder || 0);
      }
      const timeA = a.createdAt ? (a.createdAt.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt).getTime()) : 0;
      const timeB = b.createdAt ? (b.createdAt.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt).getTime()) : 0;
      return timeB - timeA;
    });

    res.json(projects);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project by slug
// @route   GET /api/projects/:slug
// @access  Public
const getProjectBySlug = async (req, res, next) => {
  try {
    const snapshot = await db.collection('projects').where('slug', '==', req.params.slug).limit(1).get();
    
    if (!snapshot.empty) {
      let project = null;
      snapshot.forEach(doc => {
        project = formatDoc(doc);
      });
      res.json(project);
    } else {
      res.status(404);
      throw new Error('Project not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
  try {
    const newProject = {
      ...req.body,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };
    
    const docRef = await db.collection('projects').add(newProject);
    const doc = await docRef.get();
    
    res.status(201).json(formatDoc(doc));
  } catch (error) {
    next(error);
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res, next) => {
  try {
    const docRef = db.collection('projects').doc(req.params.id);
    const doc = await docRef.get();
    
    if (doc.exists) {
      const updates = {
        ...req.body,
        updatedAt: FieldValue.serverTimestamp()
      };
      // Remove _id if it's in the body to avoid saving it in the document
      delete updates._id;
      
      await docRef.update(updates);
      const updatedDoc = await docRef.get();
      res.json(formatDoc(updatedDoc));
    } else {
      res.status(404);
      throw new Error('Project not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res, next) => {
  try {
    const docRef = db.collection('projects').doc(req.params.id);
    const doc = await docRef.get();
    
    if (doc.exists) {
      await docRef.delete();
      res.json({ message: 'Project removed' });
    } else {
      res.status(404);
      throw new Error('Project not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getAdminProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
};
