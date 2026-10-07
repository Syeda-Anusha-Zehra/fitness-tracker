const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder,
  checkDueReminders,
} = require("../controllers/reminderController");

router.use(protect);

router.get("/check-due", checkDueReminders);

router.route("/")
  .get(getReminders)
  .post(createReminder);

router.route("/:id")
  .put(updateReminder)
  .delete(deleteReminder);

module.exports = router;
