const express = require("express");
const router = express.Router();

const controller = require("../controllers/serviceCategoryController");
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

// Public
router.get("/", controller.listCategories);

// Admin
router.post("/", auth, role("admin"), controller.createCategory);
router.put("/:id", auth, role("admin"), controller.updateCategory);
router.delete("/:id", auth, role("admin"), controller.deleteCategory);

module.exports = router;