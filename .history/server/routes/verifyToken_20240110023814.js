const jwt = require("jsonwebtoken");
const User = require("../model/User");
const Company = require("../model/companySchema");


const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Invalid Authorization header format" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token to be verified:", token); // Debugging log

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    const Model = decoded.isCompany ? Company : User;
    const authenticatedEntity = await Model.findById(decoded.id);

    if (!authenticatedEntity) {
      return res.status(401).json({ error: "Invalid token, entity not found" });
    }

    req.user = {
      id: authenticatedEntity._id,
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
      console.error("JWT verification error:", error);

      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

module.exports = verifyToken;