const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../models/User"); // User model
const userMiddleware = require("../middleware/userMiddleware");

// ================= GET PROFILE =================
router.get("/me", userMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= UPDATE PROFILE =================
router.put("/me", userMiddleware, async (req, res) => {
  try {
    const { name, university, gpa } = req.body;

    // Use returnDocument: 'after' to return updated doc and avoid deprecation warning
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, university, gpa },
      { returnDocument: "after" } 
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating profile" });
  }
});

// ================= UPLOAD RESUME =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads/resumes";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.id}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

router.post("/upload-resume", userMiddleware, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { resume: req.file.filename },
      { returnDocument: "after" } // returns updated document
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Resume uploaded successfully", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error uploading resume" });
  }
});

module.exports = router;