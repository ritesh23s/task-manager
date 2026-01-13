const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  phone: String, // only store phone no., no OTP
  emailVerified: { type: Boolean, default: false },

  role: { type: String, default: "user" },
  isActive: { type: Boolean, default: true },

  // EMAIL VERIFICATION OTP
  emailOTP: String,
  emailOTPExpiry: Date,

  // FORGOT PASSWORD
  resetOTP: String,
  resetOTPExpiry: Date,
  resetOTPLastSent: Date,
});

module.exports = mongoose.model("User", userSchema);
