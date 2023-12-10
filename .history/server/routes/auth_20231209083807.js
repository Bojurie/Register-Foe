const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../model/User");
const authMiddleware = require("../middleware/authMiddleware");
const { generateToken } = require("../utils/authUtils");

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ id: newUser.id, username: newUser.username });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a new token after successful login
    const token = generateToken(user);

    // Include the hashed password in the response (Note: This is typically not recommended for security reasons)
    res.json({
      id: user.id,
      username: user.username,
      hashedPassword: user.password, // Include hashed password in the response
      token,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/generate-token", authMiddleware, loginUser);


module.exports = router;
