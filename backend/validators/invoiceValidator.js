const Joi = require('joi');

exports.createInvoiceSchema = Joi.object({
    projectId: Joi.string().required(),

    items: Joi.array().items().items(
        Joi.object({
            name: Joi.string().required(),
            description: Joi.string().allow('').optional(),
            quantity: Joi.number().min(1).required(),
            unitPrice: Joi.number().required()
        })
    ).min(1).required(),

    tax: Joi.number().default(0),
    discount: Joi.number().default(0),
    currency: Joi.string().default("KSH"),
    dueDate: Joi.date().required(),
    notes: Joi.string().allow('').optional()
});