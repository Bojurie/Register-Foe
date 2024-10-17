const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const { _id, username } = user;

  if (!_id || !username) {
    throw new Error("Missing user data (ID or username) for token generation");
  }

  const isCompany = user.isCompany || false; 

  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    console.error("JWT_SECRET is not defined in the environment variables.");
    throw new Error("JWT secret key is missing. Token generation failed.");
  }

  const payload = { _id: _id.toString(), username, isCompany };
  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
};

module.exports = { generateToken };
