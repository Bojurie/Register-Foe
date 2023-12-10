const express = require("express");
const router = express.Router();
const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Secret key for JWT, replace with a secure key in production
const JWT_SECRET_KEY = "your-secret-key";

// Utility function to generate a JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET_KEY, { expiresIn: "1h" });
};

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.json({ success: false, message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.json({ success: false, message: "Username not found" });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    // Generate a JWT token on successful login
    const token = generateToken(user._id);

    res.json({ success: true, message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/save-data", async (req, res) => {
  // Extract user ID from the request header (assuming the token is sent in the header)
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    const userId = decoded.userId;

    // Fetch user data from the request body
    const { dataToSave } = req.body;

    // Save user data to the database (replace this with your logic)
    // For simplicity, let's assume a delay using setTimeout
    await new Promise((resolve) => setTimeout(resolve, 1000));

    res.json({ success: true, message: "User data saved successfully" });
  } catch (error) {
    console.error("Error saving user data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
