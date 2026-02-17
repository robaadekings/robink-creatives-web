const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true,
    },

    clientName: String,
    clientEmail: String,

    // ✅ quote → project conversion reference
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

    // ✅ Client Portal Security Step 1
    clientPortalToken: {
        type: String,
        index: true
    },
},
{ timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
