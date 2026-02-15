const Invoice = require('../models/Invoice');
const Project = require('../models/Project');
const ApiError = require('../utils/ApiError');
const generateInvoicePdf = require('../utils/invoicePdf');
const { sendInvoiceEmail } = require("../services/invoiceEmailService");
const notify = require("../services/notificationService");


// =============================
// Create Invoice
// =============================
exports.createInvoice = async (req, res, next) => {
    try {

        const data = req.body;

        // validate project
        const project = await Project.findById(data.projectId);
        if (!project) throw new ApiError(404, 'Project not found');

        // calculate totals
        let subtotal = 0;

        const items = data.items.map(item => {
            const total = item.quantity * item.unitPrice;
            subtotal += total;
            return { ...item, total };
        });

        const tax = data.tax || 0;
        const discount = data.discount || 0;
        const total = subtotal + tax - discount;

        const invoice = await Invoice.create({
            ...data,
            items,
            subtotal,
            tax,
            discount,
            total,
            issueDate: new Date(),
            clientName: project.clientName,
            clientEmail: project.clientEmail
        });

        // ✅ admin notification (FIXED placement)
        await notify.createNotification({
            title: "Invoice Created",
            message: `Invoice for ${invoice.clientName}`,
            type: "invoice",
            meta: { invoiceId: invoice._id }
        });

        res.status(201).json({
            success: true,
            data: invoice
        });

    } catch (err) {
        next(err);
    }
};


// =============================
// List Invoices
// =============================
exports.listInvoices = async (req, res, next) => {
    try {

        const invoices = await Invoice.find()
            .populate('projectId', 'title status')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: invoices
        });

    } catch (err) {
        next(err);
    }
};


// =============================
// Get Invoice
// =============================
exports.getInvoice = async (req, res, next) => {
    try {

        const invoice = await Invoice
            .findById(req.params.id)
            .populate('projectId');

        if (!invoice) throw new ApiError(404, 'Invoice not found');

        res.json({
            success: true,
            data: invoice
        });

    } catch (err) {
        next(err);
    }
};


// =============================
// Update Invoice Status
// =============================
exports.updateInvoiceStatus = async (req, res, next) => {
    try {

        const { status } = req.body;

        const invoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!invoice) throw new ApiError(404, 'Invoice not found');

        // optional: notify when paid
        if (status === "paid") {
            await notify.createNotification({
                title: "Invoice Paid",
                message: `Invoice ${invoice._id} marked paid`,
                type: "payment",
                meta: { invoiceId: invoice._id }
            });
        }

        res.json({
            success: true,
            data: invoice
        });

    } catch (err) {
        next(err);
    }
};


// =============================
// Delete Invoice
// =============================
exports.deleteInvoice = async (req, res, next) => {
    try {

        const invoice = await Invoice.findByIdAndDelete(req.params.id);

        if (!invoice) throw new ApiError(404, 'Invoice not found');

        res.json({
            success: true,
            message: "Invoice deleted"
        });

    } catch (err) {
        next(err);
    }
};


// =============================
// Download Invoice PDF
// =============================
exports.downloadInvoicePdf = async (req, res, next) => {
    try {

        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found"
            });
        }

        res.setHeader(
            "Content-Disposition",
            `attachment; filename=invoice-${invoice._id}.pdf`
        );

        res.setHeader("Content-Type", "application/pdf");

        generateInvoicePdf(invoice, res);

    } catch (err) {
        next(err);
    }
};


// =============================
// Email Invoice
// =============================
exports.emailInvoice = async (req, res, next) => {
    try {

        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found"
            });
        }

        await sendInvoiceEmail(invoice);

        res.json({
            success: true,
            message: "Invoice email sent"
        });

    } catch (err) {
        next(err);
    }
};
