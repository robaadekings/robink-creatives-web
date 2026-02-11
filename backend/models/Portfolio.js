const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Web_development', 'Graphic_Design', 'branding', 'ui-ux'],
        required: true
    },
    description: String,

    images: [
        {
            type: String,
        }
    ],

    tags: [String],

    projectUrl: String,
    githubUrl: String,

    featured: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);


