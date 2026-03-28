const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  university: String,
  gpa: String,
  resume: String,

  // ✅ ADD THESE ONLY
  phone: String,
  skills: String,
  bio: String,
  profilePic: String
});

// Fix OverwriteModelError
module.exports =
  mongoose.models.Student ||
  mongoose.model("Student", studentSchema);