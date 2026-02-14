const router = require("express").Router();
const controller = require("../controllers/clientInvoiceController");

// public — token protected

router.get("/invoice/:token", controller.getInvoiceByToken);

router.get("/invoice/:token/pdf", controller.downloadPdf);

router.post("/invoice/:token/viewed", controller.markViewed);

module.exports = router;
