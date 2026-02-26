const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

const dashboard = require("../controllers/adminDashboardController");
const notif = require("../controllers/adminNotificationController");
const adminController = require("../controllers/adminController");



// =====================
// Dashboard Stats
// =====================
router.get(
  "/dashboard",
  auth,
  role("admin"),
  dashboard.getDashboardStats
);


// =====================
// Charts
// =====================
router.get(
  "/invoice-status-chart",
  auth,
  role("admin"),
  dashboard.getInvoiceStatusChart
);

router.get(
  "/revenue-by-month",
  auth,
  role("admin"),
  dashboard.getRevenueByMonth
);

// =====================
// Notifications
// =====================
router.get(
  "/notifications",
  auth,
  role("admin"),
  notif.listNotifications
);

router.get(
  "/notifications/unread-count",
  auth,
  role("admin"),
  notif.unreadCount
);

router.patch(
  "/notifications/:id/read",
  auth,
  role("admin"),
  notif.markRead
);

router.patch(
  "/users/:id/promote",
  auth,
  role("admin"),
  adminController.promoteToAdmin
);


module.exports = router;
