// routes/interviewRoutes.js
const express = require("express");
const router = express.Router();
const Interview = require("../models/Interview");
const Application = require("../models/Application");
const authMiddleware = require("../middleware/authMiddleware");

// Get all interviews FOR THIS COMPANY
router.get("/", authMiddleware, async (req, res) => {
  try {
    const interviews = await Interview.find({ company: req.company._id }).sort({ date: 1 });
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Schedule interview
router.post("/", authMiddleware, async (req, res) => {
  const { applicationId, candidateName, job, date, time, interviewer, mode, link } = req.body;
  
  try {
    const newInterview = new Interview({
      candidateName,
      job,
      applicationId,
      date,
      time,
      interviewer,
      mode,
      link,
      company: req.company._id // Assign to company
    });
    await newInterview.save();

    // Update Application Status (ensure it belongs to this company)
    if (applicationId) {
      await Application.findOneAndUpdate(
        { _id: applicationId, company: req.company._id }, 
        { status: "Interview Scheduled" }
      );
    }

    res.status(201).json(newInterview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update interview status
router.patch("/:id", authMiddleware, async (req, res) => {
  const { status } = req.body;
  try {
    const updated = await Interview.findOneAndUpdate(
      { _id: req.params.id, company: req.company._id }, 
      { status }, 
      { new: true }
    );
    if (!updated) return res.status(404).json({ msg: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;