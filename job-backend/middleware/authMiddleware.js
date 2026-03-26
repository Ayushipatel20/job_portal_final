const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // 1. Get token from header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // 2. Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // 3. Verify token
  try {
    // Make sure "secretkey" matches exactly what you used in companyRoutes.js login
    const decoded = jwt.verify(token, "secretkey");
    
    // Attach the company ID to the request object
    req.company = { _id: decoded.id };
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};