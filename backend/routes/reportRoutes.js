const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const { exportReport } = require("../controllers/reportController");

router.use(protect);
router.get("/export", exportReport);

module.exports = router;
