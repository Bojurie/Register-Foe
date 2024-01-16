const jwt = require("jsonwebtoken");

const generateToken = (account, isCompany = false) => {
  try {
    if (!account) {
      throw new Error("Account data is required for token generation");
    }

    // Prepare account data for JWT payload
    let accountData;
    if (typeof account.toObject === "function") {
      // If it's a Mongoose model, convert to a plain object
      accountData = account.toObject();
    } else {
      // If it's already a plain object, use it as is
      accountData = account;
    }

    // Create a simplified object for the JWT payload
    const payload = {
      id: accountData._id,
      username: accountData.username,
      role: isCompany ? "Company" : accountData.role || "User",
      isCompany: isCompany,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  } catch (error) {
    console.error("Error generating token:", error);
    throw error;
  }
};

module.exports = { generateToken };
