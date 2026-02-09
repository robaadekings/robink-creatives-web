const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
    {
        client: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
        title: String,
        description: String,
        services: [{type: mongoose.Schema.Types.ObjectId, ref: 'Service'}],
        status: {
            type: String,
            enum: ['planning', 'in-progress', 'review', 'completed', 'delivered'],
            default: 'planning',
            index: true
        },

        price: Number,
        deadline: Date,

        files: [String],
        deliverables: [String]


},{timestamps: true}
);
module.exports = mongoose.model('Project', projectSchema);