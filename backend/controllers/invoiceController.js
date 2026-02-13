const Invoice = require('../models/Invoice');
const Project = require('../models/Project');
const ApiError = require('../utils/ApiError');
const generateInvoicePdf = require('../utils/invoicePdf');

// Create a new invoice

exports.createInvoice = async (req, res, next) => {
    try {
        const data = req.body;

        // Validate project existence
        const project = await Project.findById(data.projectId);
        if(!project) throw new ApiError(404, 'Project not found');

        // Calculate totals
        let subtotal = 0;
        const items = data.items.map(item => {
            const total = item.quantity * item.unitPrice;
            subtotal += total;
            return { ...item, total };
         });

    const tax = data.tax || 0;
    const discount = data.discount || 0;
    const total = subtotal + tax - discount;
    const invoice = new Invoice({
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
    res.status(201).json({ success: true, data: await invoice.save() });
} catch (err) {
    next(err);
}
};

//list invoices

exports.listInvoices = async (req, res, next) => {
    try {
        const invoices = await Invoice.find().populate('projectId', 'title status')
        .sort({ createdAt: -1 });
        res.json({ success: true, data: invoices });
    } catch (err) {
        next(err);
    }
};

// Get invoice details

exports.getInvoice = async (req, res, next) => {
    try {
        const invoice = await Invoice.findById(req.params.id).populate('projectId');
        if (!invoice) throw new ApiError(404, 'Invoice not found');
        res.json({ success: true, data: invoice });
    } catch (err) {
        next(err);
    }
};

// update invoice status

exports.updateInvoiceStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        const invoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!invoice) throw new ApiError(404, 'Invoice not found');
        res.json({ success: true, data: invoice });
    } catch (err) {
        next(err);
    }
};

// delete invoice

exports.deleteInvoice = async (req, res, next) => {
    try {
        const invoice = await Invoice.findByIdAndDelete(req.params.id);

        res.json({ success: true, data: invoice });
    } catch (err) {
        next(err);
    }
};

//generate invoice pdf

exports.downloadInvoicePdf = async (req, res, next) => {
    try{
        const invoice = await Invoice.findById(req.params.id);

        if(!invoice){
            return res.status(404).json({
                success: false,
                message: "Invoice not found"
            });
        }
            res.setHeader(
                "Content-Disposition",
                ` attachment; filename=invoice-${invoice._id}.pdf`
            );
            res.setHeader("Content-Type", "application/pdf");

            generateInvoicePdf(invoice, res);
        } catch (err) {
            next(err);
            
        }
    };
