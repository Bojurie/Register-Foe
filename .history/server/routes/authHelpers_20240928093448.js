const jwt = require("jsonwebtoken");
const RefreshTokenModel = require("../model/RefreshTokenMode");
const User = require("../model/User");
const Company = require("../model/companySchema");
const Election = require("../model/electionModel");

const validateRefreshToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await RefreshTokenModel.findOne({ token });
    return !!storedToken;
  } catch (error) {
    console.error("Error validating refresh token:", error);
    return false;
  }
};

const getUserFromRefreshToken = async (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.id) throw new Error("Invalid token payload");

    const isCompany = decoded.isCompany;
    const user = isCompany
      ? await Company.findById(decoded.id)
      : await User.findById(decoded.id);

    if (!user) {
      throw new Error("Entity not found");
    }

    return {
      id: user._id,
      username: user.username,
      isCompany: isCompany,
      isAdmin: isCompany ? false : user.role === "Admin",
    };
  } catch (error) {
    console.error("Error getting user from refresh token:", error);
    throw error;
  }
};

const createUniqueElection = async (electionData) => {
  try {
    // Create a new Election document using the provided data
    const newElection = new Election({
      ...electionData,
    });

    // Save the election to the database
    await newElection.save();
    return newElection;
  } catch (error) {
    console.error("Error creating election:", error);
    throw new Error("Failed to create election");
  }
};


module.exports = {
  validateRefreshToken,
  getUserFromRefreshToken,
  createUniqueElection,
};
