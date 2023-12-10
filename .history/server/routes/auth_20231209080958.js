const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../model/User");
const authMiddleware = require("../middleware/authMiddleware");
const { generateToken } = require("./utils/authUtils");

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

export const loginUser = async (formData) => {
  try {
    const response = await axios.post("auth/login", formData);

    if (!response.data || typeof response.data.id === "undefined") {
      throw new Error("Invalid response from the server");
    }

    const { id, username, token } = response.data;

    // Check if the user is registered in your database
    if (!id || !username) {
      throw new Error("User is not registered.");
    }

    setStoredUser(response.data);
    setStoredToken(token);

    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw new Error(
      error.response?.data?.error || "Invalid username or password."
    );
  }
};


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/generate-token", authMiddleware, getUserDetails);


module.exports = router;
