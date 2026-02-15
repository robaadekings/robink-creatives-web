const Notification = require("../models/Notification");

exports.createNotification = async ({
     title,
     message,
     type,
     meta = {}
}) => {
    return Notification.create({
        title,
        message,
        type, 
        meta
    });
};