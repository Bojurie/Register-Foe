const express = require('express');

// const jwt = require("jsonwebtoken"); // Import jwt module

// const generateToken = (account, isCompany = false) => {
//   const secretKey = process.env.JWT_SECRET;
//   try {
//     if (!account) {
//       throw new Error("Account data is required for token generation");
//     }

//     // Extract only the necessary properties from the account object
//     const payload = {
//       id: account._id,
//       username: account.username,
//       role: isCompany ? "Company" : account.role || "User",
//       isCompany: isCompany,
//     };

//     return jwt.sign(payload, secretKey, { expiresIn: "1h" });
//   } catch (error) {
//     console.error("Error generating token:", error);
//     throw error;
//   }
// };

// module.exports = { generateToken };





const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error("JWT secret key is not defined in environment variables");
  }

  const payload = {
    id: user._id.toString(),
    username: user.username,
    isCompany: user.isCompany,
  };

  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
};

module.exports = { generateToken };
