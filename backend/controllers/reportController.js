const PDFDocument = require("pdfkit");
const Nutrition = require("../models/Nutrition");
const Workout = require("../models/Workout");
const Goal = require("../models/Goal");

function toCsvValue(value) {
  const str = String(value ?? "");
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

function rowsToCsv(headers, rows) {
  const lines = [headers.map(toCsvValue).join(",")];
  rows.forEach((row) => lines.push(row.map(toCsvValue).join(",")));
  return lines.join("\n");
}

function dateRangeQuery(startDate, endDate) {
  if (!startDate && !endDate) return {};
  const range = {};
  if (startDate) range.$gte = new Date(startDate);
  if (endDate) {
    const d = new Date(endDate);
    d.setHours(23, 59, 59, 999);
    range.$lte = d;
  }
  return { date: range };
}

function calcGoalProgress(goal) {
  const { type, start, current, target } = goal;
  if (type === "Weight Loss") {
    if (start === target) return 100;
    return Math.min(Math.max(((start - current) / (start - target)) * 100, 0), 100);
  }
  if (type === "Weight Gain" || type === "Muscle Gain") {
    if (target === start) return 100;
    return Math.min(Math.max(((current - start) / (target - start)) * 100, 0), 100);
  }
  if (target === 0) return 0;
  return Math.min(Math.max((current / target) * 100, 0), 100);
}

async function getNutritionData(userId, startDate, endDate) {
  const entries = await Nutrition.find({ userId, ...dateRangeQuery(startDate, endDate) }).sort({ date: 1 });
  const totals = entries.reduce(
    (acc, e) => {
      acc.calories += e.calories;
      acc.protein += e.protein;
      acc.carbs += e.carbs;
      acc.fat += e.fat;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
  return { entries, totals };
}

async function getFitnessData(userId, startDate, endDate) {
  const workouts = await Workout.find({ userId, ...dateRangeQuery(startDate, endDate) }).sort({ date: 1 });
  const goals = await Goal.find({ userId }).sort({ createdAt: -1 });
  return { workouts, goals };
}

// GET /api/reports/export?type=nutrition|fitness&format=csv|pdf&startDate=&endDate=
exports.exportReport = async (req, res) => {
  try {
    const { type, format, startDate, endDate } = req.query;

    if (!["nutrition", "fitness"].includes(type)) {
      return res.status(400).json({ message: "type must be 'nutrition' or 'fitness'." });
    }
    if (!["csv", "pdf"].includes(format)) {
      return res.status(400).json({ message: "format must be 'csv' or 'pdf'." });
    }

    if (type === "nutrition") {
      const { entries, totals } = await getNutritionData(req.userId, startDate, endDate);

      if (format === "csv") {
        const csv = rowsToCsv(
          ["Date", "Meal Type", "Food", "Quantity", "Calories", "Protein (g)", "Carbs (g)", "Fat (g)"],
          entries.map((e) => [
            new Date(e.date).toISOString().slice(0, 10),
            e.mealType,
            e.foodName,
            e.quantity,
            e.calories,
            e.protein,
            e.carbs,
            e.fat,
          ])
        );
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=nutrition-summary.csv");
        return res.send(csv);
      }

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=nutrition-summary.pdf");
      const doc = new PDFDocument({ margin: 40 });
      doc.pipe(res);
      doc.fontSize(20).text("Nutrition Summary Report", { align: "center" });
      doc.moveDown(0.3);
      doc.fontSize(10).fillColor("#666").text(`Generated ${new Date().toLocaleString()}`, { align: "center" });
      doc.moveDown(1.5);

      doc.fillColor("#000").fontSize(13).text("Totals");
      doc.fontSize(11).text(`Calories: ${totals.calories} kcal`);
      doc.text(`Protein: ${totals.protein} g`);
      doc.text(`Carbs: ${totals.carbs} g`);
      doc.text(`Fat: ${totals.fat} g`);
      doc.moveDown(1);

      doc.fontSize(13).text(`Entries (${entries.length})`);
      doc.moveDown(0.5);
      if (entries.length === 0) {
        doc.fontSize(10).fillColor("#666").text("No entries in this date range.");
      }
      entries.forEach((e) => {
        doc
          .fontSize(10)
          .fillColor("#000")
          .text(
            `${new Date(e.date).toISOString().slice(0, 10)}  [${e.mealType}]  ${e.foodName} — ${e.calories} kcal (P:${e.protein}g C:${e.carbs}g F:${e.fat}g)`
          );
      });
      doc.end();
      return;
    }

    // type === "fitness"
    const { workouts, goals } = await getFitnessData(req.userId, startDate, endDate);

    if (format === "csv") {
      const workoutsCsv = rowsToCsv(
        ["Date", "Title", "Category", "Duration (min)", "Exercises"],
        workouts.map((w) => [
          new Date(w.date).toISOString().slice(0, 10),
          w.title,
          w.category,
          w.durationMinutes,
          w.exercises.map((ex) => `${ex.name} ${ex.sets}x${ex.reps}${ex.weight ? "@" + ex.weight + "kg" : ""}`).join("; "),
        ])
      );
      const goalsCsv = rowsToCsv(
        ["Goal Title", "Type", "Start", "Current", "Target", "Unit", "Progress %", "Completed"],
        goals.map((g) => [g.title, g.type, g.start, g.current, g.target, g.unit, Math.round(calcGoalProgress(g)), g.completed ? "Yes" : "No"])
      );
      const combined = `WORKOUTS\n${workoutsCsv}\n\nGOALS\n${goalsCsv}`;
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=fitness-progress.csv");
      return res.send(combined);
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=fitness-progress.pdf");
    const doc = new PDFDocument({ margin: 40 });
    doc.pipe(res);
    doc.fontSize(20).text("Fitness Progress Report", { align: "center" });
    doc.moveDown(0.3);
    doc.fontSize(10).fillColor("#666").text(`Generated ${new Date().toLocaleString()}`, { align: "center" });
    doc.moveDown(1.5);

    doc.fillColor("#000").fontSize(13).text(`Workouts (${workouts.length})`);
    doc.moveDown(0.5);
    if (workouts.length === 0) {
      doc.fontSize(10).fillColor("#666").text("No workouts in this date range.");
    }
    workouts.forEach((w) => {
      doc
        .fontSize(10)
        .fillColor("#000")
        .text(`${new Date(w.date).toISOString().slice(0, 10)}  ${w.title} (${w.category}) — ${w.durationMinutes} min`);
      w.exercises.forEach((ex) => {
        doc.fontSize(9).fillColor("#555").text(`   • ${ex.name}: ${ex.sets}x${ex.reps}${ex.weight ? " @ " + ex.weight + "kg" : ""}`);
      });
    });
    doc.moveDown(1);

    doc.fillColor("#000").fontSize(13).text(`Goals (${goals.length})`);
    doc.moveDown(0.5);
    if (goals.length === 0) {
      doc.fontSize(10).fillColor("#666").text("No goals yet.");
    }
    goals.forEach((g) => {
      const progress = Math.round(calcGoalProgress(g));
      doc
        .fontSize(10)
        .fillColor("#000")
        .text(`${g.title} (${g.type}) — ${progress}% complete — ${g.current}${g.unit} of ${g.target}${g.unit}${g.completed ? " ✓" : ""}`);
    });
    doc.end();
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to generate report.", error: err.message });
    }
  }
};
