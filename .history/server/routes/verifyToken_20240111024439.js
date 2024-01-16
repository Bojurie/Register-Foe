const jwt = require("jsonwebtoken");
const User = require("../model/User");
const Company = require("../model/companySchema");


const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Invalid Authorization header format");
      return res
        .status(401)
        .json({ error: "Invalid Authorization header format" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Verifying token:", token); // Log the token

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Changed from !decoded.id to !decoded._id
    if (!decoded || !decoded._id) {
      console.log("Invalid token format: Missing '_id'");
      return res.status(401).json({ error: "Invalid token format" });
    }

    // Use _id to find the authenticated entity
    const Model = decoded.isCompany ? Company : User;
    const authenticatedEntity = await Model.findById(decoded._id); // Changed from decoded.id to decoded._id

    if (!authenticatedEntity) {
      console.log("Token valid but entity not found");
      return res.status(401).json({ error: "Invalid token, entity not found" });
    }

    req.user = {
      id: authenticatedEntity._id, // No change needed here
      username: authenticatedEntity.username,
      isCompany: decoded.isCompany,
      ...(decoded.isCompany && {
        companyCode: authenticatedEntity.companyCode,
      }),
    };

    next();
  } catch (error) {
    console.error("Error in token verification:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired" });
    } else {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

module.exports = verifyToken;