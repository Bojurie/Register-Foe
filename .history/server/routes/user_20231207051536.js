// routes/user.js
const express = require("express");
const router = express.Router();
const User = require("../model/User");
const authenticateJWT = require("../AuthMiddleware/authMiddleware");

// Import controllers
const {
  registerUser,
  loginUser,
  getUserDetails,
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", authenticateJWT, getUserDetails);

module.exports = router;
