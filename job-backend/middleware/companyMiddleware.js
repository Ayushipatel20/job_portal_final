const jwt = require("jsonwebtoken");
const Company = require("../models/Company");

module.exports = async (req, res, next) => {
  // 1️⃣ Get token from Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    // 2️⃣ Verify token using the same JWT_SECRET as in login
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Find company in DB by decoded ID
    const company = await Company.findById(decoded.id);
    if (!company) return res.status(401).json({ message: "Company not found" });

    // 4️⃣ Attach full company object to request
    req.company = company;

    // ✅ Proceed to next middleware/route
    next();
  } catch (err) {
    console.error("Company Auth Error:", err.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};