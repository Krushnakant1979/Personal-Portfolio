const express = require('express');
const router = express.Router();
const {
  getProjects,
  getAdminProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

router.route('/admin')
  .get(protect, getAdminProjects);

router.route('/')
  .get(getProjects)
  .post(protect, createProject);

router.route('/:slug').get(getProjectBySlug);

router.route('/:id')
  .put(protect, updateProject)
  .delete(protect, deleteProject);

module.exports = router;
