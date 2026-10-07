const ContactMessage = require("../models/ContactMessage");

// POST /api/contact
exports.createContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required." });
    }
    const contactMessage = await ContactMessage.create({ name, email, subject, message });
    res.status(201).json({ message: "Message sent successfully.", contactMessage });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Failed to send message.", error: err.message });
  }
};
