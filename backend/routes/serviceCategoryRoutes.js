const express = require("express");
const router = express.Router();

const controller = require("../controllers/serviceCategoryController");
const authMiddleware = require("../middlewares/authMiddleware").authenticateToken;
const role = require("../middlewares/roleMiddleware");

// Public
router.get("/", controller.listCategories);

// Admin
router.post("/", authMiddleware, role("admin"), controller.createCategory);
router.put("/:id", authMiddleware, role("admin"), controller.updateCategory);
router.delete("/:id", authMiddleware, role("admin"), controller.deleteCategory);

module.exports = router;