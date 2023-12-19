// Import necessary modules
const express = require("express");
const router = express.Router();
const User = require("../model/User");

router.get("/user", async (req, res) => {
  try {
    // Retrieve the user ID from the authentication token or session
    const userId = req.user.id; // You need to implement this part based on your authentication mechanism

    // Fetch the user details from the database using the user ID
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