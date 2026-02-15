const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        title: String,
        message: String,

        type: {
            type: String,
            enum: [
                "quote",
                "invoice",
                "payment",
                "project",
                "system"
            ]
        },

        read: {
            type: Boolean,
            default: false

        },

        meta: mongoose.Schema.Types.Mixed
    },

    {timestamps: true}
);

module.exports = mongoose.model(
    "Notification",
    notificationSchema
);