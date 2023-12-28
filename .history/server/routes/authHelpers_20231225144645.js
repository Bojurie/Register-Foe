const jwt = require("jsonwebtoken");

// Assuming you have a model for storing refresh tokens
const RefreshTokenModel = require("../model/RefreshTokenMode");
const User= require("../model/User");

// Validates the refresh token
const validateRefreshToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const storedToken = await RefreshTokenModel.findOne({ token: token });
    if (!storedToken) {
      return false;
    }
    // Optionally, you might want to validate other conditions like token revocation
    return true;
  } catch (error) {
    console.error("Error validating refresh token:", error);
    return false;
  }
};

const getUserFromRefreshToken = async (token) => {
  try {
    const decoded = jwt.decode(token);

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: user._id,
      username: user.username,
      isCompany: user.isCompany, // Adjust according to your user model structure
    };
  } catch (error) {
    console.error("Error getting user from refresh token:", error);
    throw error;
  }
};

module.exports = { validateRefreshToken, getUserFromRefreshToken };
