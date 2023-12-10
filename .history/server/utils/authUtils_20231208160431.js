const express = require("express");
const router = express.Router();
const User = require('../model/User')
const { generateToken } = require("../utils/authUtils"); // Import the generateToken function

router.post("/generate-token", async (req, res) => {
  try {
    const { userId } = req.body;

    // Assume User is your mongoose model representing a user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a token for the user
    const token = generateToken(user);

    // Send the token to the client
    res.json({ token });
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
