const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
    {
        title: {type: String, required: true},

        category: {
            type: String,
            enum: ["graphic design", "web development"],
            required: true,
            index: true

        },
        description: {type: String},
        features: [String],
        basePrice: Number,
        deliveryTime: String,

        active: {type: Boolean, default: true}

},
{timestamps: true}
);
module.exports = mongoose.model('Service', serviceSchema);
    