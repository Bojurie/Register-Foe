// authRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../model/User");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;

    // Check if the username is already taken
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success
    res.status(201).json({ id: newUser.id, username: newUser.username });
  } catch (error) {
    console.error("Error registering user:", error);

    // Check if it's a validation error (e.g., missing fields)
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (e) => e.message
      );
      return res.status(400).json({ error: validationErrors });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user in the database
    const user = await User.findOne({ username });

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Respond with success
    res.json({ id: user.id, username: user.username });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
