const router = require("express").Router();
const loginLimit = require("../middlewares/loginRateLimit");
const ctrl = require("../controllers/clientAuthController");

router.post("/register", ctrl.registerClient);
router.post("/login", loginLimit, ctrl.loginClient);  // This is correct

router.post("/forgot-password", ctrl.clientForgotPassword);
router.post("/reset-password/:token", ctrl.clientResetPassword);

module.exports = router;