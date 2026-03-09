const Invoice = require("../models/Invoice");
const { generateInvoicePdf } = require("../utils/invoicePdf"); 

// ===============================
// Get Invoice by Token (Public/Guest)
// ===============================
exports.getInvoiceByToken = async (req, res, next) => {
    try {
        const invoice = await Invoice.findOne({ portalToken: req.params.token }).populate("projectId");
        if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });

        /**
         * FIX: We track that it's been viewed, but keep the status 
         * as "Pending" so the Dashboard Stats can still count it.
         */
        invoice.lastViewedAt = new Date();
        
        // If your Admin set it to "Sent", move it to "Pending" so it appears on Dashboard
        if (invoice.status === "Sent" || !invoice.status) {
            invoice.status = "Pending"; 
        }

        await invoice.save();
        res.json({ success: true, invoice });
    } catch (err) { next(err); }
};

// ===============================
// Mark as Viewed
// ===============================
exports.markViewed = async (req, res, next) => {
    try {
        const invoice = await Invoice.findOne({ portalToken: req.params.token });
        if (!invoice) return res.status(404).json({ success: false });
        
        // Update timestamp but do NOT change status to a non-enum value like "Viewed"
        invoice.lastViewedAt = new Date();
        
        // Ensure it's in a state the Dashboard recognizes
        if (invoice.status !== "Paid") {
            invoice.status = "Pending";
        }

        await invoice.save();
        res.json({ success: true });
    } catch (err) { next(err); }
};

// ===============================
// Download PDF 
// ===============================
exports.downloadPdf = async (req, res, next) => {
    try {
        const invoice = await Invoice.findOne({ portalToken: req.params.token });

        if (!invoice) {
            return res.status(404).json({ success: false, message: "Invoice not found" });
        }

        // Standard PDF headers
        const filename = invoice.invoiceNumber || `INV-${invoice._id.toString().slice(-6)}`;
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=${filename}.pdf`);

        generateInvoicePdf(invoice, res); 
    } catch (err) { next(err); }
};