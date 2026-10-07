const mongoose = require("mongoose");

const GOAL_TYPES = [
  "Weight Loss",
  "Weight Gain",
  "Muscle Gain",
  "Running",
  "Workout Frequency",
  "Calories",
  "Custom",
];

const GoalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: GOAL_TYPES },
    start: { type: Number, required: true, default: 0 },
    target: { type: Number, required: true },
    current: { type: Number, default: 0 },
    unit: { type: String, default: "" },
    startDate: { type: Date, default: Date.now },
    targetDate: { type: Date },
    notes: { type: String, default: "" },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

GoalSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Goal", GoalSchema);
module.exports.GOAL_TYPES = GOAL_TYPES;
