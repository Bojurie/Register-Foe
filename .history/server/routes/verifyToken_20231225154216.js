const express = require("express");
const router = express.Router();

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header is missing" });
    }

    const token = authHeader.split(" ")[1]; // Assuming Bearer token
    if (!token) {
      return res.status(401).json({ error: "Bearer token is missing" });
    }

    // Verifying and decoding the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ error: "Token has expired" });
        }
        return res.status(401).json({ error: "Invalid token" });
      }
      if (decoded.isCompany !== true) {
        return res
          .status(403)
          .json({ error: "Access restricted to company users" });
      }

      // Assign the decoded token to the request object
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error("Error in token verification:", error.message);
    res.status(500).json({ error: "Server error during token verification" });
  }
};
module.exports = router;
