const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

// GET ALL JOBS FOR STUDENT
router.get("/", async (req, res) => {
  try {
    // 1. Find jobs
    const jobs = await Job.find({ status: "Open" })
      .populate("company", "name") 
      .sort({ posted: -1 });

    // 2. Send strictly an array
    res.json(jobs);
  } catch (err) {
    console.error("STUDENT JOB ERROR:", err);
    // Send error status so frontend doesn't think it's success
    res.status(500).json({ error: "Server error" }); 
  }
});

module.exports = router;