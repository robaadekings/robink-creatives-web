const Invoice = require("../models/Invoice");
const { generateInvoicePdf } = require("../utils/invoicePdf"); // Correct Destructuring

exports.getInvoiceByToken = async (req, res, next) => {
    try {
        const invoice = await Invoice.findOne({ portalToken: req.params.token }).populate("projectId");
        if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });

        if (invoice.status === "Sent") {
            invoice.status = "Viewed";
            invoice.lastViewedAt = new Date();
            await invoice.save();
        }
        res.json({ success: true, invoice });
    } catch (err) { next(err); }
};

exports.markViewed = async (req, res, next) => {
    try {
        const invoice = await Invoice.findOne({ portalToken: req.params.token });
        if (!invoice) return res.status(404).json({ success: false });
        invoice.status = "Viewed";
        invoice.lastViewedAt = new Date();
        await invoice.save();
        res.json({ success: true });
    } catch (err) { next(err); }
};

exports.downloadPdf = async (req, res, next) => {
    try {
        // Look up by portalToken as per your route
        const invoice = await Invoice.findOne({ portalToken: req.params.token });

        if (!invoice) {
            return res.status(404).json({ success: false, message: "Invoice not found" });
        }

        const filename = invoice.invoiceNumber || `INV-${invoice._id.toString().slice(-6)}`;
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=${filename}.pdf`);

        generateInvoicePdf(invoice, res); 
    } catch (err) { next(err); }
};