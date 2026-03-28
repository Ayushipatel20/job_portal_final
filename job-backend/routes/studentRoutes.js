const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Interview = require("../models/Interview");
const userMiddleware = require("../middleware/userMiddleware");

// ================= GET PROFILE =================
router.get("/me", userMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user?.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    const userWithResumeUrl = {
      ...user.toObject(),
      resume: user.resume || null,
      resumeUrl: user.resume
        ? `${req.protocol}://${req.get("host")}/uploads/resumes/${user.resume}`
        : null,
      profilePicUrl: user.profilePic
        ? `${req.protocol}://${req.get("host")}/uploads/profile/${user.profilePic}`
        : null,
    };

    res.json(userWithResumeUrl);
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= UPDATE PROFILE =================
router.put("/me", userMiddleware, async (req, res) => {
  try {
    const updates = {};

    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.university !== undefined) updates.university = req.body.university;
    if (req.body.gpa !== undefined) updates.gpa = req.body.gpa;
    if (req.body.phone !== undefined) updates.phone = req.body.phone;
    if (req.body.skills !== undefined) updates.skills = req.body.skills;
    if (req.body.bio !== undefined) updates.bio = req.body.bio;

    const updatedUser = await User.findByIdAndUpdate(
      req.user?.id,
      { $set: updates },
      { new: true } // ✅ FIXED
    ).select("-password");

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.json({
      ...updatedUser.toObject(),
      resume: updatedUser.resume || null,
      resumeUrl: updatedUser.resume
        ? `${req.protocol}://${req.get("host")}/uploads/resumes/${updatedUser.resume}`
        : null,
      profilePicUrl: updatedUser.profilePic
        ? `${req.protocol}://${req.get("host")}/uploads/profile/${updatedUser.profilePic}`
        : null,
    });

  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: "Error updating profile" });
  }
});

// ================= MULTER CONFIG =================
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads/resumes");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.id}-${Date.now()}${ext}`);
  },
});

// ✅ File filter (PDF only)
const resumeFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Only PDF files allowed"), false);
};

const upload = multer({
  storage: resumeStorage,
  fileFilter: resumeFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ================= UPLOAD RESUME =================
router.post(
  "/upload-resume",
  userMiddleware,
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ message: "No file uploaded" });

      const user = await User.findById(req.user.id);
      if (!user)
        return res.status(404).json({ message: "User not found" });

      if (user.resume) {
        const oldPath = path.join(__dirname, "../uploads/resumes", user.resume);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      user.resume = req.file.filename;
      await user.save();

      res.json({
        message: "Resume uploaded successfully",
        user: {
          ...user.toObject(),
          resume: user.resume || null,
          resumeUrl: user.resume
            ? `${req.protocol}://${req.get("host")}/uploads/resumes/${user.resume}`
            : null,
          profilePicUrl: user.profilePic
            ? `${req.protocol}://${req.get("host")}/uploads/profile/${user.profilePic}`
            : null,
        },
      });

    } catch (err) {
      console.error("UPLOAD RESUME ERROR:", err);
      res.status(500).json({ message: err.message || "Error uploading resume" });
    }
  }
);

// ================= PROFILE PIC UPLOAD =================
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads/profile");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-profile-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// ✅ Image filter
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files allowed"), false);
};

const uploadProfile = multer({
  storage: profileStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

router.post(
  "/upload-profile-pic",
  userMiddleware,
  uploadProfile.single("profilePic"),
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ message: "No file uploaded" });

      const user = await User.findById(req.user.id);
      if (!user)
        return res.status(404).json({ message: "User not found" });

      if (user.profilePic) {
        const oldPath = path.join(__dirname, "../uploads/profile", user.profilePic);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      user.profilePic = req.file.filename;
      await user.save();

      res.json({
        message: "Profile pic uploaded",
        user: {
          ...user.toObject(),
          resume: user.resume || null,
          resumeUrl: user.resume
            ? `${req.protocol}://${req.get("host")}/uploads/resumes/${user.resume}`
            : null,
          profilePicUrl: user.profilePic
            ? `${req.protocol}://${req.get("host")}/uploads/profile/${user.profilePic}`
            : null,
        },
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message || "Upload error" });
    }
  }
);

// ================= FETCH JOBS =================
router.get("/jobs", userMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find({ status: "Open" })
      .populate("company", "companyName")
      .sort({ posted: -1 });

    const formattedJobs = jobs.map((job) => ({
      _id: job._id,
      title: job.title,
      location: job.location,
      type: job.type,
      department: job.department,
      description: job.description,
      posted: job.posted,
      status: job.status,
      companyName: job.company?.companyName || "N/A",
    }));

    res.json(formattedJobs);
  } catch (err) {
    console.error("FETCH JOBS ERROR:", err);
    res.status(500).json({ message: "Error fetching jobs" });
  }
});

// ================= APPLY FOR JOB =================
router.post("/applications", userMiddleware, async (req, res) => {
  try {
    const { jobId } = req.body;

    const job = await Job.findById(jobId).populate("company", "companyName");
    if (!job) return res.status(404).json({ message: "Job not found" });

    const existingApp = await Application.findOne({
      student: req.user.id,
      jobId: job._id,
    });

    if (existingApp)
      return res.status(400).json({ message: "Already applied to this job" });

    const student = await User.findById(req.user.id);

    const application = new Application({
      student: student._id,
      jobId: job._id,
      job: job.title,
      company: job.company,
      name: student.name,
      email: student.email,
      university: student.university || "",
      gpa: student.gpa || "",
      resume: student.resume || "",
      status: "Under Review",
    });

    await application.save();

    res.json({ message: "Application submitted successfully" });
  } catch (err) {
    console.error("APPLY JOB ERROR:", err);
    res.status(500).json({ message: "Error applying for job" });
  }
});

// ================= GET MY APPLICATIONS =================
router.get("/applications/my", userMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user.id })
      .populate("jobId", "title location")
      .populate("company", "companyName");

    const formattedApps = applications.map((app) => ({
      _id: app._id,
      job: app.job || app.jobId?.title,
      jobId: app.jobId?._id,
      location: app.jobId?.location || "N/A",
      status: app.status,
      companyName: app.company?.companyName || "N/A",
      interviewDate: app.interviewDate || null,
    }));

    res.json(formattedApps);
  } catch (err) {
    console.error("GET APPLICATIONS ERROR:", err);
    res.status(500).json({ message: "Error fetching applications" });
  }
});

// ================= GET MY INTERVIEWS =================
router.get("/interviews/my", userMiddleware, async (req, res) => {
  try {
    const interviews = await Interview.find({ student: req.user.id })
      .populate("company", "companyName");

    const formatted = interviews.map((i) => ({
      _id: i._id,
      jobTitle: i.job || "",
      companyName: i.company?.companyName || "",
      date: i.date,
      status: i.status,
      interviewer: i.interviewer || "",
      link: i.link || "",
      mode: i.mode || "",
    }));

    res.json(formatted);
  } catch (err) {
    console.error("FETCH INTERVIEWS ERROR:", err);
    res.status(500).json({ message: "Error fetching interviews" });
  }
});

module.exports = router;