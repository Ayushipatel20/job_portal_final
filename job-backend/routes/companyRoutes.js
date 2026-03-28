const express = require("express");
const router = express.Router();
const Company = require("../models/Company");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Get logged-in company data (Protected)
const authMiddleware = require("../middleware/companyMiddleware"); // Use correct middleware

// ✅ New route to check logged-in company
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // Find company by ID from token
    const company = await Company.findById(req.company._id).select("-password");
    res.json({ loggedInCompany: company });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Existing route (kept as-is)
router.get("/company", authMiddleware, async (req, res) => {
  try {
    const company = await Company.findById(req.company._id).select("-password");
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Register
router.post("/register", async (req, res) => {
  try {
    const { companyName, email, location, password } = req.body;
    const exist = await Company.findOne({ email });
    if (exist) return res.status(400).json({ msg: "Company already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const company = await Company.create({
      companyName, email, location, password: hashedPassword,
    });
    res.json({ msg: "Registered", company });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const company = await Company.findOne({ email });
    if (!company) return res.status(400).json({ msg: "Invalid Email" });

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) return res.status(400).json({ msg: "Wrong Password" });

    // ✅ Use the same JWT secret from env
    const token = jwt.sign({ id: company._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, company });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;