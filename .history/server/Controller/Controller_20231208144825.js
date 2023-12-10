// authController.js
const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserDetails,
} = require("../Controller/Controller");

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/user", getUserDetails);

module.exports = router;

