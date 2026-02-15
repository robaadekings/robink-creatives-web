const Notification = require("../models/Notification");

exports.listNotifications = async (req, res, next) => {
  try {

    const items = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: items
    });

  } catch (err) {
    next(err);
  }
};

exports.markRead = async (req, res, next) => {
  try {

    await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true }
    );

    res.json({ success: true });

  } catch (err) {
    next(err);
  }
};

exports.unreadCount = async (req, res, next) => {
  try {

    const count = await Notification.countDocuments({
      read: false
    });

    res.json({ success: true, data: { count } });

  } catch (err) {
    next(err);
  }
};
