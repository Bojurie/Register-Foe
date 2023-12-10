const jwt = require("jsonwebtoken");
const User = require("../model/User"); // Import your User model

// Replace this with your actual secret key
const secretKey = process.env.JWT_SECRET;

const generateToken = async (user) => {
  try {
    if (!user || !user.username) {
      throw new Error("Invalid user data");
    }

    const { id, username } = user;

    // Implement your token generation logic here
    const token = jwt.sign({ userId: id }, secretKey, { expiresIn: "100d" });
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw error;
  }
};

module.exports = { generateToken };