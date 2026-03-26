const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  companyName: String,
  email: { type: String, unique: true },
  location: String,
  password: String,
}, { timestamps: true });

module.exports = mongoose.model("Company", companySchema);