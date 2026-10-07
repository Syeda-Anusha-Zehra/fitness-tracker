const User = require("../models/User");

// PUT /api/users/me
exports.updateProfile = async (req, res) => {
  try {
    const allowed = ["name", "gender", "age", "height", "weight", "notificationsEnabled", "units", "theme"];
    const updates = {};
    for (const field of allowed) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    if (updates.gender && !["Male", "Female"].includes(updates.gender)) {
      return res.status(400).json({ message: "Gender must be Male or Female." });
    }
    if (updates.units && !["metric", "imperial"].includes(updates.units)) {
      return res.status(400).json({ message: "Units must be metric or imperial." });
    }
    if (updates.theme && !["dark", "light"].includes(updates.theme)) {
      return res.status(400).json({ message: "Theme must be dark or light." });
    }

    const user = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ user: user.getPublicProfile() });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Failed to update profile.", error: err.message });
  }
};

// PUT /api/users/me/password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Provide current and new password." });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters." });
    }

    const user = await User.findById(req.userId).select("+password");
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: "Password changed successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to change password.", error: err.message });
  }
};
