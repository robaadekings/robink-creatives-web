const express = require('express');
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

const client = require('../controllers/clientController');

// 🔐 Projects
router.get('/projects', auth, role("client"), client.getClientProjects);
router.get('/project/:id', auth, role("client"), client.getClientProject);

// 🔐 Invoices
router.get('/invoices', auth, role("client"), client.getClientInvoices);
router.get('/invoice/:id', auth, role("client"), client.getClientInvoice);
router.get('/invoice/:id/pdf', auth, role("client"), client.downloadClientInvoicePdf);

// 🔐 Quotes
router.get('/quotes', auth, role("client"), client.getClientQuotes);

module.exports = router;