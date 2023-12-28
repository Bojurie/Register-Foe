const express = require("express");
const router = express.Router();
const User = require("../model/User"); // Import the User model

router.get("/users/:companyCode", async (req, res) => {
  try {
    const users = await User.find({ companyCode: req.params.companyCode });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router