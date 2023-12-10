// user.js
const express = require("express");
const router = express.Router();
const User = require("../model/User");
const bcrypt = require("bcrypt");
const authenticateJWT = require("..");

// ... (your existing code)

router.get("/user", authenticateJWT, async (req, res) => {
  try {
    // req.user should now be defined
    const user = req.user;

    // Send the user details to the client
    res.json({ id: user.id, username: user.username });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
