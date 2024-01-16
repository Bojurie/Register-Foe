const jwt = require("jsonwebtoken");

const generateToken = (account, isCompany = false) => {
  try {
    if (!account) {
      throw new Error("Account data is required for token generation");
    }

    // Pick only necessary data from account object to avoid circular references
    const payload = {
      id: account._id, // Assuming _id is a simple field and not a complex object
      username: account.username, // Same assumption as above
      role: isCompany ? "Company" : account.role || "User",
      isCompany: isCompany,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  } catch (error) {
    console.error("Error generating token:", error);
    throw error;
  }
};

module.exports = { generateToken };
