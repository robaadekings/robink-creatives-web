const express = require("express");
const router = express.Router();

const controller = require("../controllers/serviceController");
const validate = require("../middlewares/validateMiddleware");
const { createServiceSchema, updateServiceSchema } = require("../validators/serviceValidator");
const authMiddleware = require("../middlewares/authMiddleware").authenticateToken;
const role = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// Public
router.get("/", controller.listServices);

// Admin routes
router.post(
  "/",
  authMiddleware,
  role("admin"),
  upload.single("image"),
  validate(createServiceSchema),
  controller.createService
);

router.put(
  "/:id",
  authMiddleware,
  role("admin"),
  upload.single("image"),
  validate(updateServiceSchema),
  controller.updateService
);

router.delete("/:id", authMiddleware, role("admin"), controller.deleteService);

module.exports = router;
