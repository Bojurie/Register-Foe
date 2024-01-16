const jwt = require("jsonwebtoken");

const generateToken = (account, isCompany = false) => {
  try {
    if (!account) {
      throw new Error("Account data is required for token generation");
    }

    // Convert Mongoose model instance to a plain JavaScript object
    const accountData = account.toObject();

    // Create a simplified object for the JWT payload
    const payload = {
      id: accountData._id,
      username: accountData.username,
      role: isCompany ? "Company" : accountData.role || "User",
      isCompany: isCompany,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  } catch (error) {
    console.error("Error generating token:", error);
    throw error;
  }
};

module.exports = { generateToken };
