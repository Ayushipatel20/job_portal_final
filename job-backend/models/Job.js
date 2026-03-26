const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  // --- NEW FIELD ---
  // Links this job to a specific company
  company: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Company", 
    required: true 
  },
  // -----------------

  title: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, default: "Remote" },
  type: { type: String, default: "Full-time" },
  description: { type: String },
  posted: { type: Date, default: Date.now },
  applicants: { type: Number, default: 0 },
  status: { type: String, enum: ["Open", "Closed"], default: "Open" }
});

module.exports = mongoose.model("Job", JobSchema);