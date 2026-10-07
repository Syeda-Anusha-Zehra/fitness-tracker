const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please add a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    gender: {
      type: String,
      required: [true, "Please select a gender"],
      enum: {
        values: ["Male", "Female"],
        message: "Gender must be Male or Female",
      },
    },
    age: {
      type: Number,
      min: [10, "Age must be at least 10"],
      max: [120, "Age cannot be more than 120"],
    },
    height: {
      type: Number,
      min: [50, "Height must be at least 50 cm"],
      max: [300, "Height cannot be more than 300 cm"],
    },
    weight: {
      type: Number,
      min: [10, "Weight must be at least 10 kg"],
      max: [500, "Weight cannot be more than 500 kg"],
    },
    notificationsEnabled: { type: Boolean, default: true },
    units: { type: String, enum: ["metric", "imperial"], default: "metric" },
    theme: { type: String, enum: ["dark", "light"], default: "dark" },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

UserSchema.methods.getPublicProfile = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model("User", UserSchema);
