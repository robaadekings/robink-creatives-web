const Project = require('../models/Project');
const Quote = require('../models/Quote');
const ApiError = require('../utils/ApiError');
const crypto = require('crypto');


// ==============================
// Admin create project
// ==============================
exports.createProject = async (req, res, next) => {
    try {
        const data = req.body;

        // ✅ STEP 2 — generate client portal access token
        data.clientPortalToken = crypto.randomBytes(24).toString('hex');

        // attach uploaded assets
        if (req.files && req.files.length > 0) {
            data.assets = req.files.map((file) => file.path);
        }

        // if created from quote auto-fill
        if (data.sourceQuote) {
            const quote = await Quote.findById(data.sourceQuote);
            if (!quote) throw new ApiError(404, 'Quote not found');

            data.clientName = quote.clientName;
            data.clientEmail = quote.clientEmail;
            data.description = quote.description;
            data.serviceId = quote.serviceId;
        }

        const project = await Project.create(data);

        res.status(201).json({
            success: true,
            data: project,
        });

    } catch (err) {
        next(err);
    }
};
