const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');
const validate = require('../middlewares/validateMiddleware');
const{ rgisterSchema,
      loginSchema
} = require('../validators/authValidator');

router.post('/register', validate(rgisterSchema), controller.register);
router.post('/login', validate(loginSchema), controller.login);

module.exports = router;