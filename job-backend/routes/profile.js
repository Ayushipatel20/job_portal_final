// routes/profileRoutes.js
const router = require("express").Router();
const Profile = require("../models/Profile");
const auth = require("../middleware/authMiddleware");

// ✅ GET PROFILE (only logged-in user)
router.get("/", auth, async (req, res) => {
  const profile = await Profile.findOne({ userId: req.user.id });

  res.json(profile);
});

// ✅ CREATE / UPDATE PROFILE
router.post("/", auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      profile = await Profile.create({
        userId: req.user.id,
        ...req.body,
      });
    } else {
      profile = await Profile.findOneAndUpdate(
        { userId: req.user.id },
        req.body,
        { new: true }
      );
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;