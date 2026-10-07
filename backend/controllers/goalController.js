const Goal = require("../models/Goal");
const Notification = require("../models/Notification");

const calculateProgress = (goal) => {
  const { type, start, current, target } = goal;

  if (type === "Weight Loss") {
    if (start === target) return 100;
    const progress = ((start - current) / (start - target)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  }

  if (type === "Weight Gain" || type === "Muscle Gain") {
    if (target === start) return 100;
    const progress = ((current - start) / (target - start)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  }

  if (target === 0) return 0;
  const progress = (current / target) * 100;
  return Math.min(Math.max(progress, 0), 100);
};

const withProgress = (goal) => ({
  ...goal.toObject(),
  progress: Math.round(calculateProgress(goal)),
});

// POST /api/goals
exports.createGoal = async (req, res) => {
  try {
    const { title, type, start, target, current, unit, startDate, targetDate, notes } = req.body;

    const goal = await Goal.create({
      userId: req.userId,
      title,
      type,
      start,
      target,
      current,
      unit,
      startDate,
      targetDate,
      notes,
    });

    res.status(201).json({ goal: withProgress(goal) });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Failed to create goal.", error: err.message });
  }
};

// GET /api/goals
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ goals: goals.map(withProgress) });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch goals.", error: err.message });
  }
};

// GET /api/goals/:id
exports.getGoalById = async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.userId });
    if (!goal) return res.status(404).json({ message: "Goal not found." });
    res.json({ goal: withProgress(goal) });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch goal.", error: err.message });
  }
};

// PUT /api/goals/:id
exports.updateGoal = async (req, res) => {
  try {
    const allowed = ["title", "type", "start", "target", "current", "unit", "startDate", "targetDate", "notes", "completed"];
    const updates = {};
    for (const field of allowed) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!goal) return res.status(404).json({ message: "Goal not found." });

    const progress = calculateProgress(goal);
    if (progress >= 100 && !goal.completed) {
      goal.completed = true;
      await goal.save();
      await Notification.create({
        userId: req.userId,
        type: "goal_achievement",
        title: "Goal Achieved! 🎉",
        message: `Congratulations! You completed your goal: ${goal.title}`,
      });
    }

    res.json({ goal: withProgress(goal) });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Failed to update goal.", error: err.message });
  }
};

// DELETE /api/goals/:id
exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!goal) return res.status(404).json({ message: "Goal not found." });
    res.json({ message: "Goal deleted.", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete goal.", error: err.message });
  }
};
