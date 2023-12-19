const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../model/User");
const authMiddleware = require("../middleware/authMiddleware");
const { generateToken } = require("../utils/authUtils");

const handleRegistration = async (req, res) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;

    if (await User.exists({ username })) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
    });

    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      createdAt: newUser.createdAt,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const handleLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.json({ user: { id: user.id, username: user.username }, token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const generateToken = (user) => {
  const payload = { userId: user.id, username: user.username };
  const secretKey = "yourSecretKey"; // Replace with a secure key
  const options = { expiresIn: "1h" }; // Token expiration time, adjust as needed

  return jwt.sign(payload, secretKey, options);
};