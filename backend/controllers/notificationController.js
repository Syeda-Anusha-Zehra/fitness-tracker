const Notification = require("../models/Notification");

// GET /api/notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ notifications });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications.", error: err.message });
  }
};

// POST /api/notifications
exports.createNotification = async (req, res) => {
  try {
    const { type, title, message } = req.body;
    const notification = await Notification.create({ userId: req.userId, type, title, message });
    res.status(201).json({ notification });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: "Validation failed.", errors: err.errors });
    }
    res.status(500).json({ message: "Failed to create notification.", error: err.message });
  }
};

// PUT /api/notifications/:id/read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: "Notification not found." });
    res.json({ notification });
  } catch (err) {
    res.status(500).json({ message: "Failed to update notification.", error: err.message });
  }
};

// PUT /api/notifications/read-all
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.userId, read: false }, { read: true });
    res.json({ message: "All notifications marked as read." });
  } catch (err) {
    res.status(500).json({ message: "Failed to update notifications.", error: err.message });
  }
};

// DELETE /api/notifications/:id
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!notification) return res.status(404).json({ message: "Notification not found." });
    res.json({ message: "Notification deleted." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete notification.", error: err.message });
  }
};
