const express = require('express');
const router = express.Router();
const controller = require('../controllers/invoiceController');
const validate = require('../middlewares/validateMiddleware');
const authMiddleware = require('../middlewares/authMiddleware').authenticateToken;
const roles = require('../middlewares/roleMiddleware');
const { createInvoiceSchema } = require('../validators/invoiceValidator');

//Admin only
router.post('/', authMiddleware, roles('admin'), validate(createInvoiceSchema), controller.createInvoice);

router.get('/', authMiddleware, roles('admin'), controller.listInvoices);
router.get('/:id', authMiddleware, roles('admin'), controller.getInvoice);
router.put('/:id/status', authMiddleware, roles('admin'), controller.updateInvoiceStatus);
router.delete('/:id', authMiddleware, roles('admin'), controller.deleteInvoice);
router.get("/:id/pdf", authMiddleware, roles("admin"), controller.downloadInvoicePdf);
router.post("/:id/email", authMiddleware, roles("admin"), controller.emailInvoice);

module.exports = router;