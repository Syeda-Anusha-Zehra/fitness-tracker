const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const { updateProfile, changePassword } = require("../controllers/userController");

router.use(protect);
router.put("/me", updateProfile);
router.put("/me/password", changePassword);

module.exports = router;
