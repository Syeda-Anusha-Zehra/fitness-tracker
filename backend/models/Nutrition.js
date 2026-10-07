const mongoose = require("mongoose");

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snacks"];

const NutritionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    foodName: {
      type: String,
      required: [true, "Food name is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
    },
    calories: {
      type: Number,
      required: [true, "Calories is required"],
      min: [0, "Calories cannot be negative"],
    },
    protein: {
      type: Number,
      required: [true, "Protein is required"],
      min: [0, "Protein cannot be negative"],
    },
    carbs: {
      type: Number,
      required: [true, "Carbs is required"],
      min: [0, "Carbs cannot be negative"],
    },
    fat: {
      type: Number,
      required: [true, "Fat is required"],
      min: [0, "Fat cannot be negative"],
    },
    mealType: {
      type: String,
      required: [true, "Meal type is required"],
      enum: {
        values: MEAL_TYPES,
        message: "Meal type must be one of: " + MEAL_TYPES.join(", "),
      },
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
  },
  { timestamps: true }
);

// Common query pattern: a user's records for a given date, newest first
NutritionSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model("Nutrition", NutritionSchema);
module.exports.MEAL_TYPES = MEAL_TYPES;
