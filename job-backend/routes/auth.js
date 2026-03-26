const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// REGISTER (Public)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN (Public)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // Use a consistent secret (ideally from .env)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "user_secret_key", { expiresIn: "1h" });
    res.json({ user: { name: user.name, email: user.email }, token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// FORGOT PASSWORD (Public)
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email not found" });

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = resetCode;
    await user.save();

    // Email logic (ensure env variables are set)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Code",
            text: `Your password reset code is: ${resetCode}`,
        });
    } else {
        console.log("Email env vars missing. Reset code:", resetCode);
    }

    res.json({ message: "Reset code sent to your email" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// RESET PASSWORD (Public)
router.post("/reset-password", async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const user = await User.findOne({ email, resetCode: code });
    if (!user) return res.status(400).json({ message: "Invalid code or email" });

    user.password = newPassword;
    user.resetCode = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;