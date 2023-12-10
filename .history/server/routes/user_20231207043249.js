const express = require("express");
const router = express.Router();
const User = require("../model/User");
const authenticateJWT = require("../AuthMiddleware/authMiddleware");

router.get("/", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id; // Access user ID from authenticated JWT

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { id, firstName, lastName } = user;
    res.json({ id, firstName, lastName });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
