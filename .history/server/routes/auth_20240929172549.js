const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const Company = require("../model/companySchema");
const { authenticateJWT } = require("../middleware/authMiddleware");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const {
  validateRefreshToken,
  getUserFromRefreshToken,
} = require("./authHelpers");
const validateRegistrationData = require("./validation");
const { generateToken } = require("../utils/authUtils");

// Generate Access Token
const generateAccessToken = (user) => {
  return jwt.sign(
    { sub: user._id, username: user.username, isCompany: user.isCompany },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// Refresh Token Route
router.post("/token", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token required" });
  }

  try {
    const userId = validateRefreshToken(refreshToken);
    if (!userId) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    const user =
      (await User.findById(userId)) || (await Company.findById(userId));
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Error in /token route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Registration Route
router.post("/register", async (req, res) => {
  try {
    const { type, ...data } = req.body;

    // Common Password Hashing
    const hashedPassword = await bcrypt.hash(data.password, 10);

    if (type === "company") {
      if (!data.companyName || !data.username) {
        return res
          .status(400)
          .json({ error: "Missing required company registration data." });
      }

      const companyExists = await Company.findOne({
        $or: [{ companyName: data.companyName }, { username: data.username }],
      });
      if (companyExists) {
        return res
          .status(409)
          .json({
            error: "Company already exists with the provided name or username.",
          });
      }

      const newCompany = await Company.create({
        ...data,
        password: hashedPassword,
      });
      const token = generateAccessToken(newCompany);

      res.status(201).json({
        message: "Company registered successfully.",
        companyId: newCompany._id,
        token,
      });
    } else if (type === "user") {
      if (!data.username || !data.email) {
        return res
          .status(400)
          .json({ error: "Missing required user registration data." });
      }

      const userExists = await User.findOne({
        $or: [{ username: data.username }, { email: data.email }],
      });
      if (userExists) {
        return res
          .status(409)
          .json({
            error: "User already exists with the provided username or email.",
          });
      }

      const newUser = await User.create({ ...data, password: hashedPassword });
      const token = generateAccessToken(newUser);

      res.status(201).json({
        message: "User registered successfully.",
        userId: newUser._id,
        token,
      });
    } else {
      res.status(400).json({ error: "Invalid registration type." });
    }
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { username, password, isCompany } = req.body;

  try {
    const account = await getUser(username, isCompany);
    if (!account || !(await bcrypt.compare(password, account.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateAccessToken(account);
    const userResponse = isCompany
      ? {
          _id: account._id,
          companyName: account.companyName,
          companyAddress: account.companyAddress,
          companyEmail: account.companyEmail,
          phoneNumber: account.phoneNumber,
          isCompany: true,
          companyCode: account.companyCode,
        }
      : {
          _id: account._id,
          firstName: account.firstName,
          lastName: account.lastName,
          age: account.age,
          sex: account.sex,
          userProfileImage: account.userProfileImage,
          userProfileDetail: account.userProfileDetail,
          email: account.email,
          companyCode: account.companyCode,
          isCompany: false,
        };

    res.json({ token, user: userResponse });
  } catch (error) {
    console.error("Login process error:", error);
    res.status(500).json({ error: "Login process error" });
  }
});

// Utility function to get User or Company by username
const getUser = async (username, isCompany) => {
  const Model = isCompany ? Company : User;
  return Model.findOne({ username: username.trim() });
};

module.exports = router;
