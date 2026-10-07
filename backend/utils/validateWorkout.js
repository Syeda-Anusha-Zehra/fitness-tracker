const { WORKOUT_CATEGORIES } = require("../models/Workout");

function validateWorkoutPayload(body, { partial = false } = {}) {
  const errors = [];
  const { title, category, date, exercises, tags, notes, durationMinutes } = body || {};

  if (!partial || title !== undefined) {
    if (typeof title !== "string" || title.trim().length < 2) {
      errors.push("title is required and must be at least 2 characters");
    }
  }

  if (!partial || category !== undefined) {
    if (!WORKOUT_CATEGORIES.includes(category)) {
      errors.push(`category is required and must be one of: ${WORKOUT_CATEGORIES.join(", ")}`);
    }
  }

  if (!partial || date !== undefined) {
    const parsed = new Date(date);
    if (!date || isNaN(parsed.getTime())) {
      errors.push("date is required and must be a valid date");
    }
  }

  if (durationMinutes !== undefined) {
    if (typeof durationMinutes !== "number" || durationMinutes < 0) {
      errors.push("durationMinutes must be a non-negative number");
    }
  }

  if (!partial || exercises !== undefined) {
    if (!Array.isArray(exercises) || exercises.length === 0) {
      errors.push("exercises must be a non-empty array");
    } else {
      exercises.forEach((ex, i) => {
        if (!ex || typeof ex.name !== "string" || ex.name.trim().length === 0) {
          errors.push(`exercises[${i}].name is required`);
        }
        if (typeof ex.sets !== "number" || ex.sets < 1) {
          errors.push(`exercises[${i}].sets must be a number >= 1`);
        }
        if (typeof ex.reps !== "number" || ex.reps < 1) {
          errors.push(`exercises[${i}].reps must be a number >= 1`);
        }
        if (ex.weight !== undefined && (typeof ex.weight !== "number" || ex.weight < 0)) {
          errors.push(`exercises[${i}].weight must be a non-negative number`);
        }
      });
    }
  }

  if (tags !== undefined && !Array.isArray(tags)) {
    errors.push("tags must be an array of strings");
  }

  if (notes !== undefined && typeof notes !== "string") {
    errors.push("notes must be a string");
  }

  return errors;
}

module.exports = { validateWorkoutPayload };
