// controllers/userController.js
const bcrypt = require("bcrypt");
const User = require("../model/User");

const registerUser = async (req, res) => {
  try {
    // Implementation for user registration
  } catch (error) {
    // Handle errors
  }
};

const loginUser = async (req, res) => {
  try {
    // Implementation for user login
  } catch (error) {
    // Handle errors
  }
};

const getUserDetails = async (req, res) => {
  try {
    const { id, firstName, lastName } = req.user;
    res.json({ id, firstName, lastName });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { registerUser, loginUser, getUserDetails };
