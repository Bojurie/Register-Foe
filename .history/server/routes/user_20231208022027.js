const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserDetails,
} = require("../Controller/Controller");
const authenticateJWT = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", authenticateJWT, getUserDetails);

module.exports = router;
