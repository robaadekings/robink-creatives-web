const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema(
    {
         clientName: {
            type: String,
            required: true,
        },

            clientEmail: {
            type: String,
            required: true,
            },

            serviceCategory: {
            type: String,
            enum: ['graphic_design', 'web_development'],
            required: true,
            },

            serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            },

            description: {
            type: String,
            required: true,
            },

            budgetRange: String,
            deadline: String,
            attachments: [String],

            status: {
            type: String,
            enum: ['pending', 'reviewed', 'approved', 'rejected'],
            default: 'pending',
            },

            adminResponse: String
    },

{timestamps: true}

);

module.exports = mongoose.model('Quote', quoteSchema);