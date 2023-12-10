// authUtils.js
const jwt = require("jsonwebtoken");
const User = require("../model/User"); // Import your User model

// Replace this with your actual secret key
const secretKey = "your-secret-key";

const generateToken = async (username) => {
  try {
    // Check the database for the user
    const user = await User.findOne({ username });

    if (!user) {
      throw new Error("User not found");
    }

    // Implement your token generation logic here
    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: "1h" });
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw error;
  }
};

module.exports = { generateToken };
