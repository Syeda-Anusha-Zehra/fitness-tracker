const mongoose = require("mongoose");

const ContactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true, maxlength: 100 },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please add a valid email"],
    },
    subject: {
      type: String,
      enum: ["Feedback", "Bug Report", "Feature Request", "General Inquiry", "Support"],
      default: "General Inquiry",
    },
    message: { type: String, required: [true, "Message is required"], trim: true, maxlength: 2000 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactMessage", ContactMessageSchema);
