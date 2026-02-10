const express = require("express");
const router = express.Router();

const controller = require("../controllers/serviceController");
const validate = require("../middlewares/validateMiddleware"); // ✅ add this
const { createServiceSchema, updateServiceSchema } = require("../validators/serviceValidator");
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// Public
router.get("/", controller.listServices);

// Admin routes
router.post(
  "/",
  auth,
  role("admin"),
  upload.single("image"),
  validate(createServiceSchema),  // now works
  controller.createService
);

router.put(
  "/:id",
  auth,
  role("admin"),
  upload.single("image"),
  validate(updateServiceSchema),
  controller.updateService
);

router.delete("/:id", auth, role("admin"), controller.deleteService);

module.exports = router;
