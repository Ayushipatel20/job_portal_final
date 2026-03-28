const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Company = require("../models/Company");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// =======================
// USER REGISTER
// =======================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    // 🔐 HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// =======================
// USER LOGIN
// =======================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    // 🔐 COMPARE PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // ✅ SIGN JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// =======================
// COMPANY LOGIN
// =======================
router.post("/company/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const company = await Company.findOne({ email });
    if (!company) return res.status(404).json({ message: "Company not found" });

    // 🔐 COMPARE PASSWORD
    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // ✅ SIGN JWT FOR COMPANY
    const token = jwt.sign(
      { id: company._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      company: { name: company.name, email: company.email },
    });
  } catch (err) {
    console.error("Company Login Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;