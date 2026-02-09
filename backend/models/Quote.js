const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema(
    {
        client: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
        name: String,
        email: String,
        services: [{type: mongoose.Schema.Types.ObjectId, ref: 'Service'}],
        description: String,
        budgetRange: String,
        deadline: Date,

        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
            index: true
        }

},
{timestamps: true}
);
module.exports = mongoose.model('Quote', quoteSchema);