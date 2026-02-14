const Invoice = require("../models/Invoice");
const generatePdf = require("../utils/invoicePdf"); // your existing PDF stream generator


// ===============================
// GET invoice by token
// ===============================
exports.getInvoiceByToken = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOne({
      portalToken: req.params.token
    }).populate("projectId");

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found"
      });
    }

    // auto mark viewed
    if (invoice.status === "Sent") {
      invoice.status = "Viewed";
      invoice.lastViewedAt = new Date();
      await invoice.save();
    }

    res.json({
      success: true,
      invoice
    });

  } catch (err) {
    next(err);
  }
};


// ===============================
// MARK VIEWED
// ===============================
exports.markViewed = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOne({
      portalToken: req.params.token
    });

    if (!invoice) {
      return res.status(404).json({
        success: false
      });
    }

    invoice.status = "Viewed";
    invoice.lastViewedAt = new Date();
    await invoice.save();

    res.json({ success: true });

  } catch (err) {
    next(err);
  }
};


// ===============================
// DOWNLOAD PDF
// ===============================
exports.downloadPdf = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOne({
      portalToken: req.params.token
    });

    if (!invoice) {
      return res.status(404).json({
        success: false
      });
    }

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`
    );

    generatePdf(invoice, res); // stream version

  } catch (err) {
    next(err);
  }
};
