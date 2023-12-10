const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  try {
    if (!user || !user.username) {
      throw new Error("Invalid user data");
    }

    const { id, username } = user;

    // Implement your token generation logic here
    const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw error;
  }
};

module.exports = { generateToken };
