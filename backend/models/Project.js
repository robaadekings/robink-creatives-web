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

    clientPortalToken: {
        type: String,
        index: true
    },
},
{ timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);