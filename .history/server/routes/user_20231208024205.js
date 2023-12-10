const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserDetails,
} = require("../Controller/Controller");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getUserDetails);

module.exports = router;
