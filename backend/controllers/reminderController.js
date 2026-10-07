const Reminder = require("../models/Reminder");
const Notification = require("../models/Notification");

// GET /api/reminders
exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.userId }).sort({ reminderTime: 1 });
    res.json({ reminders });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reminders.", error: err.message });
  }
};

// POST /api/reminders
exports.createReminder = async (req, res) => {
  try {
    const { type, title, message, reminderTime, repeat, date } = req.body;
    const reminder = await Reminder.create({
      userId: req.userId,
      type,
      title,
      message,
      reminderTime,
      repeat,
      date,
    });
    res.status(201).json({ reminder });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Failed to create reminder.", error: err.message });
  }
};

// PUT /api/reminders/:id
exports.updateReminder = async (req, res) => {
  try {
    const allowed = ["type", "title", "message", "reminderTime", "isActive", "repeat", "date"];
    const updates = {};
    for (const field of allowed) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updates,
      { new: true, runValidators: true }
    );
    if (!reminder) return res.status(404).json({ message: "Reminder not found." });
    res.json({ reminder });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Failed to update reminder.", error: err.message });
  }
};

// GET /api/reminders/check-due?time=HH:MM&date=YYYY-MM-DD
// The frontend calls this periodically with the user's local wall-clock time
// (so it fires correctly in whatever timezone the user is actually in).
// Any active reminder whose reminderTime matches "now" and hasn't already
// fired today gets turned into a real Notification.
exports.checkDueReminders = async (req, res) => {
  try {
    const { time, date } = req.query;
    if (!time || !date) {
      return res.status(400).json({ message: "time (HH:MM) and date (YYYY-MM-DD) query params are required." });
    }

    const dueReminders = await Reminder.find({
      userId: req.userId,
      isActive: true,
      reminderTime: time,
      lastTriggeredDate: { $ne: date },
    });

    const triggered = [];
    for (const reminder of dueReminders) {
      const notification = await Notification.create({
        userId: req.userId,
        type: "reminder",
        title: reminder.title,
        message: reminder.message || `Time for: ${reminder.title}`,
      });

      reminder.lastTriggeredDate = date;
      if (reminder.repeat === "once") reminder.isActive = false;
      await reminder.save();

      triggered.push({ reminder, notification });
    }

    res.json({ triggered });
  } catch (err) {
    res.status(500).json({ message: "Failed to check reminders.", error: err.message });
  }
};

// DELETE /api/reminders/:id
exports.deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!reminder) return res.status(404).json({ message: "Reminder not found." });
    res.json({ message: "Reminder deleted." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete reminder.", error: err.message });
  }
};
