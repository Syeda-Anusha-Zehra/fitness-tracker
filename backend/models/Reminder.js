const mongoose = require("mongoose");

const ReminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["workout", "meal", "water", "goal"],
    },
    title: { type: String, required: true, trim: true },
    message: { type: String, default: "" },
    reminderTime: { type: String, required: true }, // "HH:MM"
    isActive: { type: Boolean, default: true },
    repeat: { type: String, enum: ["once", "daily", "weekly"], default: "daily" },
    date: { type: Date, default: null },
    lastTriggeredDate: { type: String, default: null }, // "YYYY-MM-DD", prevents re-firing same day
  },
  { timestamps: true }
);

ReminderSchema.index({ userId: 1, reminderTime: 1 });

module.exports = mongoose.model("Reminder", ReminderSchema);
