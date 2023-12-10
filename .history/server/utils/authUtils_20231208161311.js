// authUtils.js
const jwt = require("jsonwebtoken");

// Replace this with your actual secret key
const secretKey = "your-secret-key";

const generateToken = (user) => {
  // Implement your token generation logic here
  const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: "1h" });
  return token;
};

module.exports = { generateToken };
