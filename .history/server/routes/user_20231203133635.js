const express = require("express");
const router = express.Router();
// const bcrypt = require("bcrypt");

router.put("/api/user", async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Assume you have a user ID available (you can use authentication to get the user ID)
    const userId = "your-user-id";

    // Update user in the database
    await User.findByIdAndUpdate(userId, { username, password, email });

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
