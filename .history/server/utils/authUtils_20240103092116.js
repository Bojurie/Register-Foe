const generateToken = (account, isCompany = false) => {
      const secretKey = process.env.JWT_SECRET;
  try {
    if (!account) {
      throw new Error("Account data is required for token generation");
    }

    const payload = {
      id: account._id,
      username: account.username,
      role: isCompany ? "Company" : account.role || "User",
      isCompany: isCompany,
    };

    return jwt.sign(payload, secretKey, { expiresIn: "1h" });
  } catch (error) {
    console.error("Error generating token:", error);
    throw error;
  }
  
  };
};

module.exports = { generateToken };
