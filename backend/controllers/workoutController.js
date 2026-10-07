const mongoose = require("mongoose");
const Workout = require("../models/Workout");
const { validateWorkoutPayload } = require("../utils/validateWorkout");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// POST /api/workouts
exports.createWorkout = async (req, res) => {
  try {
    const errors = validateWorkoutPayload(req.body);
    if (errors.length) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const { title, category, date, exercises, tags, notes, durationMinutes } = req.body;

    const workout = await Workout.create({
      userId: req.userId,
      title,
      category,
      date,
      exercises,
      tags,
      notes,
      durationMinutes,
    });

    res.status(201).json({ workout });
  } catch (err) {
    res.status(500).json({ message: "Failed to create workout.", error: err.message });
  }
};

// GET /api/workouts
exports.getWorkouts = async (req, res) => {
  try {
    const { category, startDate, endDate, search, tag } = req.query;
    const query = { userId: req.userId };

    if (category && category !== "All") query.category = category;

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) {
        const d = new Date(endDate);
        d.setHours(23, 59, 59, 999);
        query.date.$lte = d;
      }
    }

    if (tag) query.tags = tag.toLowerCase();

    if (search) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [{ title: regex }, { "exercises.name": regex }, { notes: regex }, { tags: regex }];
    }

    const workouts = await Workout.find(query).sort({ date: -1, createdAt: -1 });
    res.json({ workouts });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch workouts.", error: err.message });
  }
};

// GET /api/workouts/:id
exports.getWorkoutById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid workout id" });
    }
    const workout = await Workout.findOne({ _id: req.params.id, userId: req.userId });
    if (!workout) return res.status(404).json({ message: "Workout not found." });
    res.json({ workout });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch workout.", error: err.message });
  }
};

// PUT /api/workouts/:id
exports.updateWorkout = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid workout id" });
    }

    const errors = validateWorkoutPayload(req.body, { partial: true });
    if (errors.length) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const workout = await Workout.findOne({ _id: req.params.id, userId: req.userId });
    if (!workout) return res.status(404).json({ message: "Workout not found." });

    const allowedFields = ["title", "category", "date", "exercises", "tags", "notes", "durationMinutes"];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) workout[field] = req.body[field];
    });

    await workout.save();
    res.json({ workout });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Failed to update workout.", error: err.message });
  }
};

// DELETE /api/workouts/:id
exports.deleteWorkout = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid workout id" });
    }
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!workout) return res.status(404).json({ message: "Workout not found." });
    res.json({ message: "Workout deleted.", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete workout.", error: err.message });
  }
};

// GET /api/workouts/meta/categories
exports.getCategories = async (req, res) => {
  res.json({ categories: Workout.WORKOUT_CATEGORIES });
};

// GET /api/workouts/summary/weekly?days=7
exports.getWeeklySummary = async (req, res) => {
  try {
    const days = Math.min(Math.max(Number(req.query.days) || 7, 1), 31);

    const end = new Date();
    end.setHours(0, 0, 0, 0);
    end.setDate(end.getDate() + 1);
    const start = new Date(end);
    start.setDate(start.getDate() - days);

    const [byDay, byCategory] = await Promise.all([
      Workout.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(req.userId), date: { $gte: start, $lt: end } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            count: { $sum: 1 },
            minutes: { $sum: "$durationMinutes" },
          },
        },
      ]),
      Workout.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(req.userId), date: { $gte: start, $lt: end } } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ]),
    ]);

    const byDateMap = Object.fromEntries(byDay.map((r) => [r._id, r]));
    const days_ = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(end);
      d.setDate(d.getDate() - 1 - i);
      const key = d.toISOString().slice(0, 10);
      const row = byDateMap[key];
      days_.push({ date: key, count: row?.count || 0, minutes: row?.minutes || 0 });
    }

    res.json({
      days: days_,
      byCategory: byCategory.map((c) => ({ category: c._id, count: c.count })),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to calculate weekly summary.", error: err.message });
  }
};
