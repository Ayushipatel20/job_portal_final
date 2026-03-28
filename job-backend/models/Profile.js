// models/Profile.js
const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // one profile per student
  },
  name: {
    type: String,
    required: true,
  },
  college: String,
  skills: String,
  phone: String,
  bio: String,
}, { timestamps: true });

module.exports = mongoose.model("Profile", profileSchema);