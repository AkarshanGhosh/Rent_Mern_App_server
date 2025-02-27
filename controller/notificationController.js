const Notification = require("../models/Notification");

// **Send Notification (System or Admin)**
exports.sendNotification = async (req, res) => {
  try {
    const { user, type, message, related_id } = req.body;

    const newNotification = new Notification({
      user,
      type,
      message,
      related_id,
    });

    await newNotification.save();
    res.status(201).json({ message: "Notification sent", newNotification });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// **Get Notifications for a User**
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// **Mark Notification as Read**
exports.markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    notification.is_read = true;
    await notification.save();

    res.status(200).json({ message: "Notification marked as read", notification });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// **Delete Notification (User Only)**
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    await notification.remove();
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

