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
  // Ensure all required user properties are present
  if (!user || !user._id || !user.username || user.isCompany === undefined) {
    throw new Error("User data is incomplete for token generation");
  }

  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error("JWT secret key is not defined in environment variables");
  }

  const payload = {
    id: user._id.toString(),
    username: user.username,
    isCompany: user.isCompany,
  };

  // You may consider adjusting the expiresIn value based on your application's needs
  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
};

module.exports = { generateToken };
