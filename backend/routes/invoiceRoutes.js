const express = require('express');
const router = express.Router();
const controller = require('../controllers/invoiceController');
const validate = require('../middlewares/validateMiddleware');
const auth = require('../middlewares/authMiddleware');
const roles = require('../middlewares/roleMiddleware');
const { createInvoiceSchema } = require('../validators/invoiceValidator');

//Admin only
router.post('/', auth, roles('admin'), validate(createInvoiceSchema), controller.createInvoice);

router.get('/', auth, roles('admin'), controller.listInvoices);
router.get('/:id', auth, roles('admin'), controller.getInvoice);
router.put('/:id/status', auth, roles('admin'), controller.updateInvoiceStatus);
router.delete('/:id', auth, roles('admin'), controller.deleteInvoice);
router.get("/:id/pdf", auth, roles("admin"), controller.downloadInvoicePdf);
router.post("/:id/email", auth, roles("admin"), controller.emailInvoice);

module.exports = router;