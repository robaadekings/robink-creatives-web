const Joi = require('joi');

exports.createProjectSchema = Joi.object({
    title: Joi.string().required(),
    quoteId: Joi.string().required(),
    serviceId: Joi.string().required(),
    description: Joi.string(),
    budget: Joi.number(),
    deadline: Joi.string(),
});

exports.updateProjectSchema = Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    budget: Joi.number().optional(),
    deadline: Joi.string().optional(),
    status: Joi.string()
        .valid(
            'pending',
            'in_progress',
            'waiting_client',
            'completed',
            'cancelled'
        )
        .optional(),
    adminNotes: Joi.string().allow("").optional()
});