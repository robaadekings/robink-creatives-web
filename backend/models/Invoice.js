const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
     name: String,
     description: String,
     quantity: Number,
     unitPrice: Number,
     total: Number
});

const invoiceSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    clientName: String,
    clientEmail: String,
    items: [itemSchema],

    subtotal: Number,
    tax: Number,
    discount: Number,
    total: Number,

    currency: {type: String, default: "KSH"},
    status: { type: String, enum: ['Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'], default: 'Draft' },

    issueDate: Date,
    dueDate: Date,
    notes: String
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
 