const mongoose = require("mongoose");
const Nutrition = require("../models/Nutrition");

const dayRange = (dateStr) => {
  const start = new Date(dateStr);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
};

// CREATE  POST /api/nutrition
exports.createNutrition = async (req, res) => {
  try {
    const { foodName, quantity, calories, protein, carbs, fat, mealType, date } = req.body;

    const record = await Nutrition.create({
      userId: req.userId,
      foodName,
      quantity,
      calories,
      protein,
      carbs,
      fat,
      mealType,
      date,
    });

    res.status(201).json(record);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: "Validation failed.", errors: err.errors });
    }
    res.status(500).json({ message: "Failed to create nutrition record.", error: err.message });
  }
};

// READ (list + search/filter)  GET /api/nutrition
exports.getNutrition = async (req, res) => {
  try {
    const { mealType, date, startDate, endDate, search } = req.query;
    const query = { userId: req.userId };

    if (mealType && mealType !== "All") query.mealType = mealType;

    if (date) {
      const { start, end } = dayRange(date);
      query.date = { $gte: start, $lt: end };
    } else if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = dayRange(startDate).start;
      if (endDate) query.date.$lt = dayRange(endDate).end;
    }

    if (search) query.foodName = { $regex: search, $options: "i" };

    const records = await Nutrition.find(query).sort({ date: -1, createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch nutrition records.", error: err.message });
  }
};

// READ single  GET /api/nutrition/:id
exports.getNutritionById = async (req, res) => {
  try {
    const record = await Nutrition.findOne({ _id: req.params.id, userId: req.userId });
    if (!record) return res.status(404).json({ message: "Nutrition record not found." });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch nutrition record.", error: err.message });
  }
};

// UPDATE  PUT/PATCH /api/nutrition/:id
exports.updateNutrition = async (req, res) => {
  try {
    const allowedFields = ["foodName", "quantity", "calories", "protein", "carbs", "fat", "mealType", "date"];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const record = await Nutrition.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!record) return res.status(404).json({ message: "Nutrition record not found." });
    res.json(record);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: "Validation failed.", errors: err.errors });
    }
    res.status(500).json({ message: "Failed to update nutrition record.", error: err.message });
  }
};

// DELETE  DELETE /api/nutrition/:id
exports.deleteNutrition = async (req, res) => {
  try {
    const record = await Nutrition.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!record) return res.status(404).json({ message: "Nutrition record not found." });
    res.json({ message: "Nutrition record deleted.", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete nutrition record.", error: err.message });
  }
};

// WEEKLY TOTALS  GET /api/nutrition/summary/weekly?days=7
exports.getWeeklyTotals = async (req, res) => {
  try {
    const days = Math.min(Math.max(Number(req.query.days) || 7, 1), 31);

    const end = new Date();
    end.setHours(0, 0, 0, 0);
    end.setDate(end.getDate() + 1); // exclusive end = start of tomorrow
    const start = new Date(end);
    start.setDate(start.getDate() - days);

    const rows = await Nutrition.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.userId),
          date: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          calories: { $sum: "$calories" },
          protein: { $sum: "$protein" },
          carbs: { $sum: "$carbs" },
          fat: { $sum: "$fat" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill in every day in the range, even ones with no entries, so the chart has no gaps
    const byDate = Object.fromEntries(rows.map((r) => [r._id, r]));
    const series = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(end);
      d.setDate(d.getDate() - 1 - i);
      const key = d.toISOString().slice(0, 10);
      const row = byDate[key];
      series.push({
        date: key,
        calories: row?.calories || 0,
        protein: row?.protein || 0,
        carbs: row?.carbs || 0,
        fat: row?.fat || 0,
      });
    }

    res.json({ days: series });
  } catch (err) {
    res.status(500).json({ message: "Failed to calculate weekly totals.", error: err.message });
  }
};
exports.getDailyTotals = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "A date query param is required." });

    const { start, end } = dayRange(date);

    const [totals] = await Nutrition.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.userId),
          date: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: null,
          calories: { $sum: "$calories" },
          protein: { $sum: "$protein" },
          carbs: { $sum: "$carbs" },
          fat: { $sum: "$fat" },
          entries: { $sum: 1 },
        },
      },
    ]);

    res.json(
      totals
        ? {
            date,
            calories: totals.calories,
            protein: totals.protein,
            carbs: totals.carbs,
            fat: totals.fat,
            entries: totals.entries,
          }
        : { date, calories: 0, protein: 0, carbs: 0, fat: 0, entries: 0 }
    );
  } catch (err) {
    res.status(500).json({ message: "Failed to calculate daily totals.", error: err.message });
  }
};
