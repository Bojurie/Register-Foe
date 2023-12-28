const jwt = require("jsonwebtoken");

const RefreshTokenModel = require("../model/RefreshTokenMode");
const User= require("../model/User");

const validateRefreshToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const storedToken = await RefreshTokenModel.findOne({ token: token });
    if (!storedToken) {
      return false;
    }
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
      isCompany: user.isCompany, 
  } catch (error) {
    console.error("Error getting user from refresh token:", error);
    throw error;
  }
};

module.exports = { validateRefreshToken, getUserFromRefreshToken };
