const Quote = require('../models/Quote');
const ApiError = require('../utils/ApiError');
const notify = require("../services/notificationService");


// =============================
// Public — Submit Quote Request
// =============================
exports.createQuote = async (req, res, next) => {
    try {
        const data = req.body;

        if (req.files && req.files.length > 0) {
            data.attachments = req.files.map(file => file.path);
        }

        const quote = await Quote.create(data);

        // ✅ create admin notification
        await notify.createNotification({
            title: "New Quote Request",
            message: `${quote.name} requested a quote`,
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
// Admin — Update Quote Status
// =============================
exports.updateQuoteStatus = async (req, res, next) => {
    try {

        const { id } = req.params;

        const quote = await Quote.findByIdAndUpdate(
            id,
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
// Admin — Single Quote
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
// Admin — Delete Quote
// =============================
exports.deleteQuote = async (req, res, next) => {
    try {

        const { id } = req.params;

        const quote = await Quote.findByIdAndDelete(id);

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
