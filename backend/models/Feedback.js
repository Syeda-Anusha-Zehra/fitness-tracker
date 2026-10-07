const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    category: {
      type: String,
      enum: ["General", "Bug Report", "Feature Request", "Other"],
      default: "General",
    },
    message: { type: String, required: [true, "Message is required"], trim: true, maxlength: 2000 },
  },
  { timestamps: true }
);

FeedbackSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Feedback", FeedbackSchema);
