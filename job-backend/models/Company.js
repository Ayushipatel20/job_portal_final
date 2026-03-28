const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  companyName: String,
  email: { type: String, unique: true },
  location: String,
  password: String,
}, { timestamps: true });

// ✅ Fix: use the correct variable name
module.exports = mongoose.models.Company || mongoose.model("Company", companySchema);