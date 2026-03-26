const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

// Import Config
const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/auth");           // Candidate Auth
const companyRoutes = require("./routes/companyRoutes"); // Company/HR Auth
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const interviewRoutes = require("./routes/interviewRoutes");

dotenv.config();
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);             // Candidates use this
app.use("/api/company", companyRoutes);       // HR/Companies use this
app.use("/api/jobs", jobRoutes);              
app.use("/api/applications", applicationRoutes); 
app.use("/api/interviews", interviewRoutes);   

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));