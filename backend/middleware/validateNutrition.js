const { body, validationResult } = require("express-validator");
const { MEAL_TYPES } = require("../models/Nutrition");

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Validation failed.", errors: errors.array() });
  }
  next();
};

// Full validation for creating a record (all fields required)
exports.validateCreate = [
  body("foodName").trim().notEmpty().withMessage("Food name is required."),
  body("quantity").isFloat({ min: 0 }).withMessage("Quantity must be a non-negative number."),
  body("calories").isFloat({ min: 0 }).withMessage("Calories must be a non-negative number."),
  body("protein").isFloat({ min: 0 }).withMessage("Protein must be a non-negative number."),
  body("carbs").isFloat({ min: 0 }).withMessage("Carbs must be a non-negative number."),
  body("fat").isFloat({ min: 0 }).withMessage("Fat must be a non-negative number."),
  body("mealType").isIn(MEAL_TYPES).withMessage(`Meal type must be one of: ${MEAL_TYPES.join(", ")}`),
  body("date").isISO8601().withMessage("Date must be a valid date."),
  handleValidation,
];

// Partial validation for updates (fields optional, but must be valid if present)
exports.validateUpdate = [
  body("foodName").optional().trim().notEmpty().withMessage("Food name cannot be empty."),
  body("quantity").optional().isFloat({ min: 0 }).withMessage("Quantity must be a non-negative number."),
  body("calories").optional().isFloat({ min: 0 }).withMessage("Calories must be a non-negative number."),
  body("protein").optional().isFloat({ min: 0 }).withMessage("Protein must be a non-negative number."),
  body("carbs").optional().isFloat({ min: 0 }).withMessage("Carbs must be a non-negative number."),
  body("fat").optional().isFloat({ min: 0 }).withMessage("Fat must be a non-negative number."),
  body("mealType").optional().isIn(MEAL_TYPES).withMessage(`Meal type must be one of: ${MEAL_TYPES.join(", ")}`),
  body("date").optional().isISO8601().withMessage("Date must be a valid date."),
  handleValidation,
];
