const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const Job = require("../models/Job");
const userMiddleware = require("../middleware/userMiddleware"); // Use STUDENT middleware


// ✅ APPLY FOR A JOB
router.post("/", userMiddleware, async (req, res) => {
  try {
    const { jobId } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // ✅ FIX: correct duplicate check (use jobId not job)
    const existing = await Application.findOne({
      user: req.user._id,
      jobId: jobId,
    });

    if (existing) {
      return res.status(400).json({ message: "Already applied" });
    }

    // ✅ Create Application (ADDED DETAILS, NO REMOVAL)
    const newApp = new Application({
      user: req.user._id,        // keep your field
      student: req.user._id,     // ✅ NEW (for isolation logic)
      company: job.company,      // already correct

      jobId: job._id,            // ✅ important
      job: job.title,            // optional display

      // ✅ ADD THESE (important for UI)
      name: req.user.name,
      email: req.user.email,
      university: req.user.university,
      gpa: req.user.gpa,
      resume: req.user.resume,

      status: "Under Review",    // better default
    });

    await newApp.save();

    res.status(201).json({ message: "Applied successfully", application: newApp });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ GET MY APPLICATIONS (Student View)
router.get("/my", userMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({
      user: req.user._id, // ✅ FIX (_id instead of id)
    })
      .populate("jobId", "title company location") // ✅ FIX (jobId instead of job)
      .sort({ appliedDate: -1 });

    res.json(applications);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;