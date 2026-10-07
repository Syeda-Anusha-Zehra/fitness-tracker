const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");
const { validateCreate, validateUpdate } = require("../middleware/validateNutrition");
const {
  createNutrition,
  getNutrition,
  getNutritionById,
  updateNutrition,
  deleteNutrition,
  getDailyTotals,
  getWeeklyTotals,
} = require("../controllers/nutritionController");

// Every route requires a valid auth token
router.use(protect);

// Specific routes before the /:id route so they aren't treated as an id
router.get("/summary/weekly", getWeeklyTotals);
router.get("/summary/daily", getDailyTotals);

router.route("/")
  .get(getNutrition)
  .post(validateCreate, createNutrition);

router.route("/:id")
  .get(getNutritionById)
  .put(validateUpdate, updateNutrition)
  .patch(validateUpdate, updateNutrition)
  .delete(deleteNutrition);

module.exports = router;
