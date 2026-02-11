const express = require('express');
const router = express.Router();

const projectController = require('../controllers/projectController');
const validate = require('../middlewares/validateMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');

const {
  createProjectSchema,
  updateProjectSchema,
} = require('../validators/projectValidator');


// ============================
// ADMIN ONLY ROUTES
// ============================

router.post(
  '/',
  auth,                    // ✅ first verify token
  role('admin'),           // ✅ then check role
  upload.array('assets', 5),
  validate(createProjectSchema),
  projectController.createProject
);

router.get(
  '/',
  auth,
  role('admin'),
  projectController.listProjects
);

router.get(
  '/:id',
  auth,
  role('admin'),
  projectController.getProject
);

router.put(
  '/:id',
  auth,
  role('admin'),
  upload.array('assets', 5),
  validate(updateProjectSchema),
  projectController.updateProject
);

router.delete(
  '/:id',
  auth,
  role('admin'),
  projectController.deleteProject
);

module.exports = router;
