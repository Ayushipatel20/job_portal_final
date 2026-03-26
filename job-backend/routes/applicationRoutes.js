// routes/applicationRoutes.js
const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const authMiddleware = require("../middleware/authMiddleware");

// Get all applications FOR THIS COMPANY
router.get("/", authMiddleware, async (req, res) => {
  const { status } = req.query;
  
  // Base filter is always the company ID
  const filter = { company: req.company._id };
  if (status && status !== "All") filter.status = status;
  
  try {
    const apps = await Application.find(filter).sort({ appliedDate: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create application
router.post("/", authMiddleware, async (req, res) => {
  try {
    const newApp = new Application({
      ...req.body,
      company: req.company._id // Assign to company
    });
    await newApp.save();
    res.status(201).json(newApp);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update application status
router.patch("/:id", authMiddleware, async (req, res) => {
  const { status } = req.body;
  try {
    // Ensure ownership before updating
    const updatedApp = await Application.findOneAndUpdate(
      { _id: req.params.id, company: req.company._id }, 
      { status }, 
      { new: true }
    );
    if (!updatedApp) return res.status(404).json({ msg: "Not found" });
    res.json(updatedApp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;