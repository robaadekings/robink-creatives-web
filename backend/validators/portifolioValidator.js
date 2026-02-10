const joi = require('joi');

exports.createPortfolioSchema = joi.object({
    title: joi.string().required(),
    category: joi.string().valid('Web_development', 'Graphic_Design', 'branding', 'ui-ux').required(),

    description: joi.string().allow("").optional(),

    tags: joi.array().items(joi.string()).optional(),

    projectUrl: joi.string().uri().allow("").optional(),
    githubUrl: joi.string().uri().allow("").optional(),

    featured: joi.boolean().optional()
});

exports.updatePortfolioSchema = joi.object({
    title: joi.string().optional(),
    category: joi.string().valid('Web_development', 'Graphic_Design', 'branding', 'ui-ux').optional(),
    description: joi.string().allow("").optional(),
    tags: joi.array().items(joi.string()).optional(),
    projectUrl: joi.string().uri().allow("").optional(),
    githubUrl: joi.string().uri().allow("").optional(),
    featured: joi.boolean().optional()
});