const Feedback = require("../models/Feedback");

// POST /api/feedback
exports.createFeedback = async (req, res) => {
  try {
    const { rating, category, message } = req.body;
    if (!rating || !message) {
      return res.status(400).json({ message: "Rating and message are required." });
    }
    const feedback = await Feedback.create({ userId: req.userId, rating, category, message });
    res.status(201).json({ feedback });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Failed to submit feedback.", error: err.message });
  }
};

// GET /api/feedback  (the current user's own submitted feedback)
exports.getMyFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ feedback });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch feedback.", error: err.message });
  }
};
