const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
    {
        project: {type: mongoose.Schema.Types.ObjectId, ref: 'Project'},
        amount: Number,
        status: {type: String, enum: ['unpaid', 'paid', 'overdue'], default: 'unpaid'},
        dueDate: Date,

}, {timestamps: true});
module.exports = mongoose.model('Invoice', invoiceSchema);