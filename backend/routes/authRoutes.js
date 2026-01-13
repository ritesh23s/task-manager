const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Task = require("../models/Task");

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  sendOTPEmail,
  sendPasswordResetSuccessEmail,
  sendVerifyEmailOTP,
} = require("../utils/sendEmail");


// ======================
//        REGISTER 
// ======================

// SEND EMAIL OTP ONLY
router.post("/register", async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase();

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // TEMP STORE OTP (in-memory for now)
    global.registerOTPStore = global.registerOTPStore || {};
    global.registerOTPStore[normalizedEmail] = {
      otp,
      expiry: Date.now() + 5 * 60 * 1000,
    };

    res.json({
      message: "OTP sent to email. Please verify to continue.",
    });

    sendVerifyEmailOTP(normalizedEmail, otp).catch((err) =>
      console.error("VERIFY EMAIL ERROR:", err.message)
    );

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// VERIFY EMAIL OTP + CREATE ACCOUNT

router.post("/register/verify-email", async (req, res) => {
  try {
    const { name, email, password, phone, otp } = req.body;
    const normalizedEmail = email.toLowerCase();

    const record = global.registerOTPStore?.[normalizedEmail];
    if (
      !record ||
      record.otp !== otp ||
      record.expiry < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ADMIN LOGIC (FIRST USER ONLY)
    const totalUsers = await User.countDocuments();
    const role = totalUsers === 0 ? "admin" : "user";

    await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      phone,
      emailVerified: true,
      role,
      isActive: true,
    });

    // CLEANUP OTP
    delete global.registerOTPStore[normalizedEmail];

    res.json({
      message: "Account created successfully. You can now login.",
    });

  } catch (err) {
    console.error("EMAIL VERIFY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================
//        LOGIN
// ======================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.emailVerified)
      return res.status(403).json({ message: "Email not verified" });

    if (!user.isActive)
      return res.status(403).json({ message: "Account disabled" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      name: user.name,
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ======================
//      ADMIN ROUTES
// ======================

router.put("/admin/user/:id/toggle", auth, admin, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.isActive = !user.isActive;
  await user.save();

  res.json({ message: "User status updated", isActive: user.isActive });
});

router.delete("/admin/user/:id", auth, admin, async (req, res) => {
  const userId = req.params.id;

  await Task.deleteMany({ user: userId });
  await User.findByIdAndDelete(userId);

  res.json({ message: "User and all related tasks deleted permanently" });
});


// ======================
//     FORGOT PASSWORD
// ======================

// SEND OTP
router.post("/forgot-password", async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (
      user.resetOTPLastSent &&
      Date.now() - user.resetOTPLastSent < 30 * 1000
    ) {
      return res.status(429).json({ message: "Please wait before retrying" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOTP = otp;
    user.resetOTPExpiry = Date.now() + 5 * 60 * 1000;
    user.resetOTPLastSent = Date.now();
    await user.save();

    res.json({ message: "OTP sent. Valid for 5 minutes." });

    sendOTPEmail(email, otp).catch((err) =>
      console.error("OTP EMAIL ERROR:", err.message)
    );

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ======================
//    RESET PASSWORD
// ======================
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (
    !user.resetOTP ||
    user.resetOTP !== otp ||
    user.resetOTPExpiry < Date.now()
  ) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetOTP = null;
  user.resetOTPExpiry = null;
  await user.save();

  res.json({ message: "Password reset successful" });

  sendPasswordResetSuccessEmail(email).catch(() => {});
});

module.exports = router;
