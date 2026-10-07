require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const nutritionRoutes = require("./routes/nutritionRoutes");
const goalRoutes = require("./routes/goalRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const contactRoutes = require("./routes/contactRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

connectDB();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/reports", reportRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong.", error: err.message });
});

module.exports = app;
