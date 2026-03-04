const express = require('express');
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware").authenticateToken;
const role = require("../middlewares/roleMiddleware");

const client = require('../controllers/clientController');

// 🔐 Dashboard
router.get('/dashboard', authMiddleware, role("client"), client.getDashboardStats);

// 🔐 Projects
router.get('/projects', authMiddleware, role("client"), client.getClientProjects);
router.get('/project/:id', authMiddleware, role("client"), client.getClientProject);

// 🔐 Invoices
router.get('/invoices', authMiddleware, role("client"), client.getClientInvoices);
router.get('/invoice/:id', authMiddleware, role("client"), client.getClientInvoice);
router.get('/invoice/:id/pdf', authMiddleware, role("client"), client.downloadClientInvoicePdf);

// 🔐 Quotes
router.get('/quotes', authMiddleware, role("client"), client.getClientQuotes);

// 🔐 Files
router.get('/files', authMiddleware, role("client"), client.getClientFiles);

// 🔐 Messages
router.get('/project/:projectId/messages', authMiddleware, role("client"), client.getProjectMessages);
router.post('/project/:projectId/messages', authMiddleware, role("client"), client.sendProjectMessage);

module.exports = router;