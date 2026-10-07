const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, gender, age, height, weight } = req.body;

    if (!name || !email || !password || !gender) {
      return res.status(400).json({ message: "Name, email, password and gender are required." });
    }
    if (!["Male", "Female"].includes(gender)) {
      return res.status(400).json({ message: "Gender must be Male or Female." });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const user = await User.create({
      name,
      email,
      password,
      gender,
      age: age || undefined,
      height: height || undefined,
      weight: weight || undefined,
    });

    const token = signToken(user._id);
    res.status(201).json({ token, user: user.getPublicProfile() });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Registration failed.", error: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = signToken(user._id);
    res.json({ token, user: user.getPublicProfile() });
  } catch (err) {
    res.status(500).json({ message: "Login failed.", error: err.message });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ user: req.user.getPublicProfile() });
};
