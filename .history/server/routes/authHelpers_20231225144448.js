const jwt = require("jsonwebtoken");

// Assuming you have a model for storing refresh tokens
const RefreshTokenModel = require("../model/RefreshTokenMode");
const User= require("../model/User");

// Validates the refresh token
const validateRefreshToken = async (token) => {
  try {
    // Verifying the token's integrity and expiry
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    // Check if the token exists in the database
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

// Retrieves user data from a given refresh token
const getUserFromRefreshToken = async (token) => {
  try {
    // Decode the token without verifying (since it's already verified in the previous step)
    const decoded = jwt.decode(token);

    // Fetch the user from the database
    const user = await UserModel.findById(decoded.id);
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
