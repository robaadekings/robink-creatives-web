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
  role("admin", "superadmin"),
  dashboard.getDashboardStats
);


// =====================
// Charts
// =====================
router.get(
  "/invoice-status-chart",
  auth,
  role("admin", "superadmin"),
  dashboard.getInvoiceStatusChart
);

router.get(
  "/revenue-by-month",
  auth,
  role("admin", "superadmin"),
  dashboard.getRevenueByMonth
);

// =====================
// Notifications
// =====================
router.get(
  "/notifications",
  auth,
  role("admin", "superadmin"),
  notif.listNotifications
);

router.get(
  "/notifications/unread-count",
  auth,
  role("admin", "superadmin"),
  notif.unreadCount
);

router.patch(
  "/notifications/:id/read",
  auth,
  role("admin", "superadmin"),
  notif.markRead
);

router.patch(
  "/users/:id/promote",
  auth,
  role("admin", "superadmin"),
  adminController.promoteToAdmin
);


module.exports = router;
