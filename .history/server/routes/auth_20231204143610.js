const express = require("express");
const router = express.Router();
const User = require("../Schema/User");
const bcrypt = require("bcrypt");



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
    res.json({ success: true, message: "Login successful" });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
module.exports =router