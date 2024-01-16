const express = require('express');
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error("JWT secret key is not defined in environment variables");
  }


  if (!user._id || !user.username || user.isCompany === undefined) {
    throw new Error("User data is incomplete for token generation");
  }

  const payload = {
    _id: user._id.toString(),
    username: user.username,
    isCompany: user.isCompany,
  };

  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
};

module.exports = { generateToken };
