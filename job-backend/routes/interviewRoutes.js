// routes/interviewRoutes.js
const express = require("express");
const router = express.Router();
const Interview = require("../models/Interview");
const Application = require("../models/Application");

// ✅ Company authentication middleware
const companyMiddleware = require("../middleware/companyMiddleware");
const userMiddleware = require("../middleware/userMiddleware");

// ======================================================
// 🏢 COMPANY: Get all interviews
// ======================================================
router.get("/", companyMiddleware, async (req, res) => {
  try {
    // Always query by current company _id
    const interviews = await Interview.find({ company: req.company._id })
      .sort({ date: 1 })
      .populate("student", "name email university gpa")
      .populate("job", "title");

    res.json(interviews);
  } catch (err) {
    console.error("Get Interviews Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ======================================================
// 🏢 COMPANY: Schedule interview
// ======================================================
router.post("/", companyMiddleware, async (req, res) => {
  const {
    applicationId,
    candidateName,
    job,
    date,
    time,
    interviewer,
    mode,
    link,
  } = req.body;

  try {
    // ✅ Ensure application exists
    const app = await Application.findById(applicationId);
    if (!app) return res.status(404).json({ msg: "Application not found" });

    // ✅ Always attach logged-in company and student
    const newInterview = new Interview({
      candidateName: candidateName || app.name,
      job: job || app.job,
      applicationId: app._id,
      date,
      time,
      interviewer,
      mode: mode || "Video Call",
      link,
      company: req.company._id, // persist company correctly
      student: app.student,     // persist student correctly
    });

    await newInterview.save();

    // ✅ Update application status to reflect interview
    await Application.findByIdAndUpdate(app._id, {
      status: "Interview Scheduled",
    });

    res.status(201).json(newInterview);
  } catch (err) {
    console.error("Schedule Interview Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ======================================================
// 🏢 COMPANY: Update interview status
// ======================================================
router.patch("/:id", companyMiddleware, async (req, res) => {
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

// ======================================================
// 🎓 STUDENT: Get MY interviews
// ======================================================
// STUDENT: Get MY interviews
router.get("/my", userMiddleware, async (req, res) => {
  try {
    const interviews = await Interview.find({ student: req.user._id })
      .populate("company", "name") // <-- ensure 'name' populated
      .populate("job", "title")
      .sort({ date: 1 });

    const formatted = interviews.map((i) => ({
      _id: i._id,
      jobTitle: i.job?.title || i.job,
      companyName: i.company ? i.company.name : "N/A", // <-- fix N/A
      date: i.date,
      status: i.status,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;