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
    const { companyCode } = req.params;

    if (!companyCode) {
      return res.status(400).json({ error: "Company code is required" });
    }

    const users = await User.find({ companyCode });
    res.status(200).json(users); // Return an empty array if no users found
  } catch (error) {
    console.error("Error retrieving users by company code:", error);
    res.status(500).json({ error: "Internal Server Error" });
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