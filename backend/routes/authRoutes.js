const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const{ registerSchema,
      loginSchema
} = require('../validators/authValidator');

router.post('/register', validate(registerSchema), controller.register);
router.post('/login', validate(loginSchema), controller.login);
router.get('/me', authenticateToken, controller.getMe);
router.post('/forgot-password', controller.forgotPassword);
router.post('/reset-password/:token', controller.resetPassword);

module.exports = router;