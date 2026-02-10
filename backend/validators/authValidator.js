//joi validation schema

const Joi = require('joi');

exports.registerSchema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    company: Joi.string().allow(''),
    phone: Joi.string().allow('')
});

exports.loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});