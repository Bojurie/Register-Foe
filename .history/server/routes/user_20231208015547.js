const express = require("express");
const router = express.Router();
const authenticateJWT = require("./middleware/authMiddleware");
const userController = require("../controllers/userController");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/", authenticateJWT, userController.getUserDetails);

module.exports = router;
