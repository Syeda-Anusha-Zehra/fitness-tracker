const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const { createFeedback, getMyFeedback } = require("../controllers/feedbackController");

router.use(protect);
router.route("/").get(getMyFeedback).post(createFeedback);

module.exports = router;
