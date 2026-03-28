const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    // ✅ Use environment variable JWT_SECRET (same as companyMiddleware)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach company ID to request (for routes that use this middleware)
    req.company = { _id: decoded.id };
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};