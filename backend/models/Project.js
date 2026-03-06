const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true,
    },

    // 🔥 NEW — Proper Relation
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Keep for compatibility (PDF / emails)
    clientName: String,
    clientEmail: String,

    sourceQuote: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quote',
    },

    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
    },

    description: String,
    budget: Number,
    deadline: String,

    status: {
        type: String,
        enum: [
            'pending',
            'approved',
            'in_progress',
            'waiting_client',
            'completed',
            'cancelled',
        ],
        default: 'pending',
    },

    assets: [String],
    deliverables: [String],
    adminNotes: String,

    // References to generated documents
    quoteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quote',
    },

    invoiceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice',
    },

    clientPortalToken: {
        type: String,
        index: true
    },
},
{ timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);