const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
    {
        title: {type: String, required: true},

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ServiceCategory",
            required: true,


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
    