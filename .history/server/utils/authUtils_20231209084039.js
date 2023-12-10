const jwt = require("jsonwebtoken");
const User = require("../model/User"); // Import your User model

// Replace this with your actual secret key
const secretKey = process.env.JWT_SECRET;

const generateToken = async (username) => {
  try {
    console.log("Username for token generation:", username);

    // Check the database for the user
    const user = await User.findOne({ username });
    console.log("User data:", user);

    if (!user) {
      throw new Error("User not found");
    }

    // Implement your token generation logic here
    const token = jwt.sign({ userId: user.id }, secretKey, {
      expiresIn: "100d",
    });
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw error;
  }
};

module.exports = { generateToken };