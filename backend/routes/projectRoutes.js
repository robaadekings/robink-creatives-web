const express = require('express');
const router = express.Router();

const projectController = require('../controllers/projectController');
const validate = require('../middlewares/validateMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const authMiddleware = require('../middlewares/authMiddleware').authenticateToken;
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
  authMiddleware,                    // ✅ first verify token
  role('admin'),           // ✅ then check role
  upload.array('assets', 5),
  validate(createProjectSchema),
  projectController.createProject
);

router.get(
  '/',
  authMiddleware,
  role('admin'),
  projectController.listProjects
);

router.get(
  '/:id',
  authMiddleware,
  role('admin'),
  projectController.getProject
);

router.put(
  '/:id',
  authMiddleware,
  role('admin'),
  upload.array('assets', 5),
  validate(updateProjectSchema),
  projectController.updateProject
);

router.put(
  '/:id/approve',
  authMiddleware,
  role('admin'),
  projectController.approveProject
);

router.delete(
  '/:id',
  authMiddleware,
  role('admin'),
  projectController.deleteProject
);

module.exports = router;
