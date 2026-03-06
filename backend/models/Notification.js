const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false  // Made optional for admin notifications
    },

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
{ timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);