const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware").authenticateToken;
const role = require("../middlewares/roleMiddleware");

const dashboard = require("../controllers/adminDashboardController");
const notif = require("../controllers/adminNotificationController");
const adminController = require("../controllers/adminController");
const projectController = require("../controllers/projectController");



// =====================
// Dashboard Stats
// =====================
router.get(
  "/dashboard",
  authMiddleware,
  role("admin", "superadmin"),
  dashboard.getDashboardStats
);


// =====================
// Charts
// =====================
router.get(
  "/invoice-status-chart",
  authMiddleware,
  role("admin", "superadmin"),
  dashboard.getInvoiceStatusChart
);

router.get(
  "/revenue-by-month",
  authMiddleware,
  role("admin", "superadmin"),
  dashboard.getRevenueByMonth
);

// =====================
// Clients Management
// =====================
router.get(
  "/clients",
  authMiddleware,
  role("admin", "superadmin"),
  adminController.listClients
);

router.get(
  "/clients/:id",
  authMiddleware,
  role("admin", "superadmin"),
  adminController.getClientDetails
);

// =====================
// Projects Management
// =====================
router.get(
  "/projects",
  authMiddleware,
  role("admin", "superadmin"),
  adminController.listProjects
);

router.put(
  "/projects/:id/approve",
  authMiddleware,
  role("admin", "superadmin"),
  projectController.approveProject
);

router.patch(
  "/projects/:id/status",
  authMiddleware,
  role("admin", "superadmin"),
  adminController.updateProjectStatus
);

// =====================
// Invoices Management
// =====================
router.get(
  "/invoices",
  authMiddleware,
  role("admin", "superadmin"),
  adminController.listInvoices
);

router.patch(
  "/invoices/:id/status",
  authMiddleware,
  role("admin", "superadmin"),
  adminController.updateInvoiceStatus
);

// =====================
// Quotes Management
// =====================
router.get(
  "/quotes",
  authMiddleware,
  role("admin", "superadmin"),
  adminController.listQuotes
);

router.patch(
  "/quotes/:id/status",
  authMiddleware,
  role("admin", "superadmin"),
  adminController.updateQuoteStatus
);

// =====================
// Notifications
// =====================
router.get(
  "/notifications",
  authMiddleware,
  role("admin", "superadmin"),
  notif.listNotifications
);

router.get(
  "/notifications/unread-count",
  authMiddleware,
  role("admin", "superadmin"),
  notif.unreadCount
);

router.patch(
  "/notifications/:id/read",
  authMiddleware,
  role("admin", "superadmin"),
  notif.markRead
);

// =====================
// User Management
// =====================
router.patch(
  "/users/:id/promote",
  authMiddleware,
  role("admin", "superadmin"),
  adminController.promoteToAdmin
);


module.exports = router;
