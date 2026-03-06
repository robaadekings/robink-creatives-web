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
            enum: ['graphic-design', 'web-development'],
            required: true,
            },

            serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            },

            projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
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

            adminResponse: String,
            convertedToInvoice: {
                type: Boolean,
                default: false
            },
            invoiceId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Invoice'
            },

            clientApproved: {
                type: Boolean,
                default: false
            },

            approvedAt: Date
    },

{timestamps: true}

);

module.exports = mongoose.model('Quote', quoteSchema);