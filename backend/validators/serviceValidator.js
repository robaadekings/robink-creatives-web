const Joi = require("joi");

exports.createServiceSchema = Joi.object({
  title: Joi.string().required(),
  category: Joi.string()
    .valid("graphic_design", "web_development")
    .required(),
  description: Joi.string().allow("").optional(), // optional string
  features: Joi.array().items(Joi.string()).optional(), // optional array
  basePrice: Joi.number().min(0).optional(), // optional number
  deliveryTime: Joi.string().allow("").optional()
});

exports.updateServiceSchema = Joi.object({
  title: Joi.string().optional(),
  category: Joi.string()
    .valid("graphic_design", "web_development")
    .optional(),
  description: Joi.string().allow("").optional(),
  features: Joi.array().items(Joi.string()).optional(),
  basePrice: Joi.number().min(0).optional(),
  deliveryTime: Joi.string().allow("").optional(),
  active: Joi.boolean().optional()
});
