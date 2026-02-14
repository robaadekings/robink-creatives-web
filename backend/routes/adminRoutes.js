const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

const dashboard = require("../controllers/adminDashboardController");

router.get(
  "/dashboard",
  auth,
  role("admin"),
  dashboard.getDashboardStats
);

module.exports = router;
