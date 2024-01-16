const jwt = require("jsonwebtoken");
const User = require("./path/to/userModel");
const Company = require("./path/to/companyModel");

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Invalid Authorization header format" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let authenticatedEntity;
    if (decoded.isCompany) {
      authenticatedEntity = await Company.findById(decoded.id);
    } else {
      authenticatedEntity = await User.findById(decoded.id);
    }

    if (!authenticatedEntity) {
      return res.status(401).json({ error: "Invalid token, entity not found" });
    }

    // Add the user or company details to req.user
    req.user = {
      id: authenticatedEntity._id,
      username: authenticatedEntity.username,
      isCompany: !!decoded.isCompany,
      companyCode: authenticatedEntity.companyCode, // Assuming both User and Company models have companyCode
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
