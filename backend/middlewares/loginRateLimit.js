const rateLimit = require("express-rate-limit");

// 5 attempts per 15 minutes
module.exports = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many login attempts. Try again later."
  },
  standardHeaders: true,
  legacyHeaders: false
});
