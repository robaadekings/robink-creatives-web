const Quote = require('../models/Quote');
const Invoice = require('../models/Invoice');
const ApiError = require('../utils/ApiError');
const notify = require("../services/notificationService");


// =============================
// Public — Submit Quote Request
// =============================
exports.createQuote = async (req, res, next) => {
    try {
        const data = req.body;

        // handle attachments
        if (req.files && req.files.length > 0) {
            data.attachments = req.files.map(file => file.path);
        }

        const quote = await Quote.create(data);

        // admin notification
        await notify.createNotification({
            title: "New Quote Request",
            message: `${quote.clientName} requested a quote`,
            type: "quote",
            meta: { quoteId: quote._id }
        });

        res.status(201).json({
            success: true,
            data: quote
        });

    } catch (error) {
        next(error);
    }
};


// =============================
// Admin — List Quotes
// =============================
exports.listQuotes = async (req, res, next) => {
    try {
        const quotes = await Quote.find()
            .populate('serviceId', 'title category')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: quotes
        });

    } catch (error) {
        next(error);
    }
};


// =============================
// Admin — Get Single Quote
// =============================
exports.getQuote = async (req, res, next) => {
    try {
        const quote = await Quote
            .findById(req.params.id)
            .populate('serviceId');

        if (!quote) {
            throw new ApiError(404, 'Quote not found');
        }

        res.status(200).json({
            success: true,
            data: quote
        });

    } catch (error) {
        next(error);
    }
};


// =============================
// Admin — Update Quote Status
// =============================
exports.updateQuoteStatus = async (req, res, next) => {
    try {
        const quote = await Quote.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!quote) {
            throw new ApiError(404, 'Quote not found');
        }

        res.status(200).json({
            success: true,
            data: quote
        });

    } catch (error) {
        next(error);
    }
};


// =============================
// Admin — Delete Quote
// =============================
exports.deleteQuote = async (req, res, next) => {
    try {
        const quote = await Quote.findByIdAndDelete(req.params.id);

        if (!quote) {
            throw new ApiError(404, 'Quote not found');
        }

        res.status(200).json({
            success: true,
            message: 'Quote deleted successfully'
        });

    } catch (error) {
        next(error);
    }
};


// =======================================
// Admin — Convert Quote → Invoice
// =======================================
exports.convertQuoteToInvoice = async (req, res, next) => {
    try {
        const { id } = req.params;

        const quote = await Quote.findById(id);

        if (!quote) {
            throw new ApiError(404, "Quote not found");
        }

        if (quote.convertedToInvoice) {
            throw new ApiError(400, "Quote already converted");
        }

        const { items, tax = 0, discount = 0 } = req.body;

        if (!items || items.length === 0) {
            throw new ApiError(400, "Invoice items required");
        }

        // calculate totals
        let subtotal = 0;

        const mappedItems = items.map(item => {
            const total = item.quantity * item.unitPrice;
            subtotal += total;
            return { ...item, total };
        });

        const total = subtotal + tax - discount;

        // create invoice
        const invoice = await Invoice.create({
            clientName: quote.clientName,
            clientEmail: quote.clientEmail,
            items: mappedItems,
            subtotal,
            tax,
            discount,
            total,
            status: "draft",
            issueDate: new Date(),
            sourceQuoteId: quote._id
        });

        // mark quote converted
        quote.convertedToInvoice = true;
        quote.invoiceId = invoice._id;
        await quote.save();

        // admin notification
        await notify.createNotification({
            title: "Quote Converted",
            message: `Quote from ${quote.clientName} converted to invoice`,
            type: "invoice",
            meta: { invoiceId: invoice._id }
        });

        res.status(201).json({
            success: true,
            message: "Quote converted to invoice",
            data: invoice
        });

    } catch (error) {
        next(error);
    }
};
