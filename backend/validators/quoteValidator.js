const joi = require('joi');

exports.createQuoteSchema = joi.object({
    clientName: joi.string().required(),
    clientEmail: joi.string().email().required(),

    serviceCategory: joi.string().valid('graphic_design', 'web_development').required(),

    serviceId: joi.string().optional(),

    description: joi.string().required(),

    budgetRange: joi.string().optional(),
    deadline: joi.string().optional(),
    attachments: joi.array().items(joi.string()).optional(),
});

exports.updateQuoteStatusSchema = joi.object({
    status: joi.string().valid('pending', 'reviewed', 'approved', 'rejected').required(),
    adminResponse: joi.string().optional(),
});