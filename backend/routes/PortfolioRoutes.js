const express = require('express');
const router = express.Router();

const controller = require('../controllers/PortifolioController');
const validate = require('../middlewares/validateMiddleware');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const {
  createPortfolioSchema,
  updatePortfolioSchema
} = require('../validators/portifolioValidator');


// ✅ GET ALL
router.get('/', controller.listPortfolios);

// ✅ GET ONE BY ID (matches controller name)
router.get('/:id', controller.getPortfolio);

// ✅ CREATE
router.post(
  '/',
  auth,
  role('admin'),
  upload.array('images', 5),
  validate(createPortfolioSchema),
  controller.createPortfolio
);

// ✅ UPDATE
router.put(
  '/:id',
  auth,
  role('admin'),
  upload.array('images', 5),
  validate(updatePortfolioSchema),
  controller.updatePortfolio
);

// ✅ DELETE
router.delete(
  '/:id',
  auth,
  role('admin'),
  controller.deletePortfolio
);

module.exports = router;
