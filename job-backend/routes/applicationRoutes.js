// routes/applicationRoutes.js
const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const authMiddleware = require("../middleware/authMiddleware");

// Get all applications FOR THIS COMPANY
router.get("/", authMiddleware, async (req, res) => {
  const { status } = req.query;
  
  const filter = { company: req.company._id };
  if (status && status !== "All") filter.status = status;
  
  try {
    const apps = await Application.find(filter)
      .populate("company", "name") // populate company
      .sort({ appliedDate: -1 });

    const formattedApps = apps.map((app) => ({
      ...app._doc,
      companyName: app.company ? app.company.name : "N/A", // fix N/A
    }));

    res.json(formattedApps);
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
{ returnDocument: "after" }
    );
    if (!updatedApp) return res.status(404).json({ msg: "Not found" });
    res.json(updatedApp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;