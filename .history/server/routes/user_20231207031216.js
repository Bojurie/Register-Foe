// Import necessary modules
const express = require("express");
const router = express.Router();
const User = require("../model/User");

router.get("/", async (req, res) => {
  try {
    const userId = req.user.id; // You need to implement this part based on your 
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Send the user details to the client
    res.json({ id: user.id, username: user.username });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;