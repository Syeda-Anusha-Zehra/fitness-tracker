const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  getCategories,
  getWeeklySummary,
} = require("../controllers/workoutController");

router.use(protect);

router.get("/meta/categories", getCategories);
router.get("/summary/weekly", getWeeklySummary);

router.route("/").get(getWorkouts).post(createWorkout);
router.route("/:id").get(getWorkoutById).put(updateWorkout).delete(deleteWorkout);

module.exports = router;
