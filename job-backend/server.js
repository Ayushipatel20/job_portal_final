const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

// Import Config
const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/auth");             
const companyRoutes = require("./routes/companyRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const userRoutes = require("./routes/user");

// Student Routes
const studentRoutes = require("./routes/studentRoutes");
const studentJobRoutes = require("./routes/studentJobRoutes");
const studentAppRoutes = require("./routes/studentAppRoutes");

dotenv.config();
const app = express();

// Connect to Database
connectDB();

// ======================================================
// 🧩 MIDDLEWARE
// ======================================================
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// ✅ Serve ALL uploads (IMPORTANT FIX)
app.use("/uploads", express.static("uploads"));

// (Optional - keep if needed)
app.use("/uploads/resumes", express.static("uploads/resumes"));


// ======================================================
// 🏢 COMPANY + GENERAL ROUTES
// ======================================================
app.use("/api/auth", authRoutes); 
app.use("/api/company", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/user", userRoutes);

// ======================================================
// 🎓 STUDENT ROUTES
// ======================================================
app.use("/api/student", studentRoutes);
app.use("/api/student/jobs", studentJobRoutes);
app.use("/api/student/applications", studentAppRoutes);


// ======================================================
// ❌ 404 HANDLER
// ======================================================
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ======================================================
// 🚀 SERVER START
// ======================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));