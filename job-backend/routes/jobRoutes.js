// routes/jobRoutes.js
const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const authMiddleware = require("../middleware/authMiddleware");

// Get all jobs FOR THIS COMPANY
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Filter by company ID
    const jobs = await Job.find({ company: req.company._id }).sort({ posted: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new job
router.post("/", authMiddleware, async (req, res) => {
  try {
    const newJob = new Job({
      ...req.body,
      company: req.company._id // Assign to logged-in company
    });
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Toggle Job Status
router.patch("/:id/toggle", authMiddleware, async (req, res) => {
  try {
    // Ensure the job belongs to the company
    let job = await Job.findOne({ _id: req.params.id, company: req.company._id });
    if (!job) return res.status(404).json({ message: "Job not found or unauthorized" });
    
    job.status = job.status === "Open" ? "Closed" : "Open";
    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;