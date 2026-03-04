const express = require("express");
const router = express.Router();
const controller = require("../controllers/contactController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const roleCheck = require("../middlewares/roleMiddleware");

// Public routes
router.post("/", controller.createContact);

// Admin routes
router.get("/", authenticateToken, roleCheck("admin", "superadmin"), controller.getAllMessages);
router.get("/:id", authenticateToken, roleCheck("admin", "superadmin"), controller.getMessage);
router.post("/:id/reply", authenticateToken, roleCheck("admin", "superadmin"), controller.replyToMessage);

module.exports = router;