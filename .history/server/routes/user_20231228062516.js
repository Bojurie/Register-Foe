const express = require("express");
const router = express.Router();
const User = require("../model/User"); // Import the User model
const verifyToken =  require("./verifyToken");

//Create User
router.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});







router.get("/users/byCompanyCode/:companyCode", async (req, res) => {
  try {
    if (!req.user.isCompany) {
      return res
        .status(403)
        .json({ error: "Access denied: Company rights required" });
    }
    const { companyCode } = req.params;
    const users = await User.find({ companyCode });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error retrieving users:", error.message);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
});


// Get User by Id
router.get("/users/:id",verifyToken ,async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});


//Update User
router.patch("/users/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});


// Delete User by Id
router.delete("/users/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router