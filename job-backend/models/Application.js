// models/Application.js
const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  // --- NEW FIELD ---
  // This links the application to a specific company
  company: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Company", 
    required: true 
  },
  // -----------------
  
  name: { type: String, required: true },
  email: { type: String, required: true },
  
  // Link to the specific Job ID
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  
  // Store job title for easy display (optional if you populate jobId)
  job: { type: String }, 
  
  university: { type: String },
  gpa: { type: String },
  appliedDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ["Under Review", "Shortlisted", "Interview Scheduled", "Selected", "Rejected"], 
    default: "Under Review" 
  },
  resume: { type: String }
});

module.exports = mongoose.model("Application", ApplicationSchema);