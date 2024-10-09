const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const { _id, username } = user;

  if (!_id || !username) {
    throw new Error("Incomplete user data for token generation");
  }

  const isCompany = user.isCompany || false; // Set default as false for regular users

  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) throw new Error("JWT secret key is not defined");

  const payload = { _id: _id.toString(), username, isCompany };
  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
};

module.exports = { generateToken };
