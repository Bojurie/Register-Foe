// File: routes/refreshToken.js

const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../model/User"); 
const router = express.Router();

router.post("/token", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token required" });
  }
  // Verify the refresh token
  const userId = validateRefreshToken(refreshToken);
  if (!userId) {
    return res.status(403).json({ error: "Invalid refresh token" });
  }
  // Find the user based on the token's user ID
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Generate a new access token
  const accessToken = jwt.sign(
    { sub: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // Set the desired expiration time for the access token
  );

  res.json({ accessToken });
});

module.exports = router;
