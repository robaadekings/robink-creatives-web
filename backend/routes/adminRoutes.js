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
// Clients Management
// =====================
router.get(
  "/clients",
  auth,
  role("admin", "superadmin"),
  adminController.listClients
);

router.get(
  "/clients/:id",
  auth,
  role("admin", "superadmin"),
  adminController.getClientDetails
);

// =====================
// Projects Management
// =====================
router.get(
  "/projects",
  auth,
  role("admin", "superadmin"),
  adminController.listProjects
);

router.patch(
  "/projects/:id/status",
  auth,
  role("admin", "superadmin"),
  adminController.updateProjectStatus
);

// =====================
// Invoices Management
// =====================
router.get(
  "/invoices",
  auth,
  role("admin", "superadmin"),
  adminController.listInvoices
);

router.patch(
  "/invoices/:id/status",
  auth,
  role("admin", "superadmin"),
  adminController.updateInvoiceStatus
);

// =====================
// Quotes Management
// =====================
router.get(
  "/quotes",
  auth,
  role("admin", "superadmin"),
  adminController.listQuotes
);

router.patch(
  "/quotes/:id/status",
  auth,
  role("admin", "superadmin"),
  adminController.updateQuoteStatus
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

// =====================
// User Management
// =====================
router.patch(
  "/users/:id/promote",
  auth,
  role("admin", "superadmin"),
  adminController.promoteToAdmin
);


module.exports = router;
