const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    title: String,
    category: String,
    description: String,
    images: [String],
    tags: [String],
    clientName: String

}, {timestamps: true}
);
module.exports = mongoose.model('Portfolio', portfolioSchema);