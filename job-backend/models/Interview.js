const mongoose = require("mongoose");

const InterviewSchema = new mongoose.Schema({
  // --- NEW FIELD ---
  // Links this interview to a specific student
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Student", // ✅ Must match your student model
    required: true 
  },
  
  company: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Company", 
    required: true 
  },
  // -----------------

  candidateName: { type: String, required: true },
  job: { type: String },
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
  date: { type: String }, // Stored as string to match frontend input type="date"
  time: { type: String },
  interviewer: { type: String },
  mode: { type: String, default: "Video Call" },
  link: { type: String },
  status: { 
    type: String, 
    enum: ["Scheduled", "Completed", "Cancelled"], 
    default: "Scheduled" 
  }
});

// Avoid multiple model compilation errors
module.exports = mongoose.models.Interview || mongoose.model("Interview", InterviewSchema);