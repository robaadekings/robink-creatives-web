const express = require('express');
const router = express.Router();
const client = require('../controllers/clientController');

// projects
router.get('/projects/:email', client.getClientProjects);
router.get('/project/:id', client.getClientProject);

// invoices
router.get('/invoices/:email', client.getClientInvoices);
router.get('/invoice/:id', client.getClientInvoice);
router.get('/invoice/:id/pdf', client.downloadClientInvoicePdf);

// quotes
router.get('/quotes/:email', client.getClientQuotes);

module.exports = router;
