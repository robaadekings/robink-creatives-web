const express = require('express');
const router = express.Router();

const controller = require('../controllers/portfolioController');
const validate = require('../middlewares/validateMiddleware');
const authMiddleware = require('../middlewares/authMiddleware').authenticateToken;
const role = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const {
  createPortfolioSchema,
  updatePortfolioSchema
} = require('../validators/portfolioValidator');


// ✅ GET ALL
router.get('/', controller.listPortfolios);

// ✅ GET ONE BY ID (matches controller name)
router.get('/:id', controller.getPortfolio);

// ✅ CREATE
router.post(
  '/',
  authMiddleware,
  role('admin'),
  upload.array('images', 5),
  validate(createPortfolioSchema),
  controller.createPortfolio
);

// ✅ UPDATE
router.put(
  '/:id',
  authMiddleware,
  role('admin'),
  upload.array('images', 5),
  validate(updatePortfolioSchema),
  controller.updatePortfolio
);

// ✅ DELETE
router.delete(
  '/:id',
  authMiddleware,
  role('admin'),
  controller.deletePortfolio
);

module.exports = router;
