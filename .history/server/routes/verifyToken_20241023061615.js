const jwt = require("jsonwebtoken");
const User = require("../model/User");
const Company = require("../model/companySchema");

const verifyToken = async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded._id) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const authenticatedEntity = await findEntityById(
      decoded._id,
      decoded.isCompany
    );
    if (!authenticatedEntity) {
      return res.status(404).json({ error: "User not found" });
    }
    req.user = {
      ...authenticatedEntity.toObject(),
      isCompany: decoded.isCompany,
      role:
        authenticatedEntity.role || (decoded.isCompany ? "Company" : "User"), 
      isAdmin: authenticatedEntity.role === "Admin",
    };

    next();
  } catch (error) {
    handleErrorInTokenVerification(error, res);
  }
};

const findEntityById = async (id, isCompany) => {
  const Model = isCompany ? Company : User;
  return Model.findById(id).select("role companyCode");
};

const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  return authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
};

const handleErrorInTokenVerification = (error, res) => {
  if (error.name === "JsonWebTokenError") {
    res.status(401).json({ error: "Invalid token" });
  } else if (error.name === "TokenExpiredError") {
    res.status(401).json({ error: "Token has expired" });
  } else {
    console.error("Error in token verification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = verifyToken;
