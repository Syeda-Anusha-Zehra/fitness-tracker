const mongoose = require("mongoose");

const WORKOUT_CATEGORIES = ["Strength", "Cardio", "Flexibility", "HIIT", "Yoga", "Other"];

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Exercise name is required"], trim: true, maxlength: 100 },
    sets: { type: Number, required: [true, "Sets is required"], min: 1, max: 100 },
    reps: { type: Number, required: [true, "Reps is required"], min: 1, max: 1000 },
    weight: { type: Number, default: 0, min: 0 },
    notes: { type: String, trim: true, maxlength: 500, default: "" },
  },
  { _id: true }
);

const workoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: [true, "Title is required"], trim: true, minlength: 2, maxlength: 120 },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: { values: WORKOUT_CATEGORIES, message: `Category must be one of: ${WORKOUT_CATEGORIES.join(", ")}` },
    },
    date: { type: Date, required: [true, "Date is required"] },
    durationMinutes: { type: Number, min: 0, default: 0 },
    exercises: {
      type: [exerciseSchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "A workout must include at least one exercise",
      },
    },
    tags: {
      type: [String],
      default: [],
      set: (tags) =>
        Array.isArray(tags)
          ? [...new Set(tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean))]
          : [],
    },
    notes: { type: String, trim: true, maxlength: 1000, default: "" },
  },
  { timestamps: true }
);

workoutSchema.index({ userId: 1, category: 1 });
workoutSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model("Workout", workoutSchema);
module.exports.WORKOUT_CATEGORIES = WORKOUT_CATEGORIES;
