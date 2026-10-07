const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");
const {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
} = require("../controllers/goalController");

router.use(protect);

router.route("/")
  .get(getGoals)
  .post(createGoal);

router.route("/:id")
  .get(getGoalById)
  .put(updateGoal)
  .delete(deleteGoal);

module.exports = router;
