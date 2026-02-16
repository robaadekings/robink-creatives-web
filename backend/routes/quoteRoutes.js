const express = require('express');
const router = express.Router();
const controller = require('../controllers/quoteController');
const validate = require('../middlewares/validateMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const { createQuoteSchema, updateQuoteStatusSchema } = require('../validators/quoteValidator');

//public submit quote
router.post(
    '/',
    upload.array('attachments', 5),
    validate(createQuoteSchema),
    controller.createQuote
);

//admin view all quotes
router.get(
    '/',
    auth,
    role('admin'),
    controller.listQuotes
);
//admin view single quote details
router.get(
    '/:id',
    auth,
    role('admin'),
    controller.getQuote
);

//admin update quote status
router.patch(
    '/:id/status',
    auth,
    role('admin'),
    validate(updateQuoteStatusSchema),
    controller.updateQuoteStatus
);

//admin delete quote (optional)
router.delete(
    '/:id',
    auth,
    role('admin'),
    controller.deleteQuote
);

//quote invoice conversion
router.post(
    "/:id/convert-to-invoice",
    auth,
    role("admin"),
    controller.convertQuoteToInvoice  
);
module.exports = router;
