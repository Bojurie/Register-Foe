const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const verifyAsync = promisify(jwt.verify);


const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Invalid Authorization header format" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await verifyAsync(token, process.env.JWT_SECRET);

    // Check if the user's role is "Company" or "Admin", or if it's a company account
    if (
      decoded.role !== "Company" &&
      decoded.role !== "Admin" &&
      !decoded.isCompany
    ) {
      return res
        .status(403)
        .json({ error: "Access restricted to company and admin users" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error in token verification:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired" });
    }
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = verifyToken;