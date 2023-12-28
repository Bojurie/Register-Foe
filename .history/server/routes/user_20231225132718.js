const express = require("express");
const router = express.Router();
const User = require("../model/User"); // Import the User model
const { authenticateJWT } = require("../middleware/authMiddleware");
const jwt = require("jsonwebtoken");


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

router.get("/users/byCompanyCode", async (req, res) => {
  try {
    // Extract the token from the Authorization header
    // const authHeader = req.headers.authorization;
  

    const token = authHeader.split(" ")[1]; // Assuming Bearer token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Invalid token" });
      }

      // Use decoded data
      const { id, isCompany } = decoded;
      if (!isCompany) {
        return res
          .status(403)
          .json({ error: "Access denied: Company rights required" });
      }

      // Now you can proceed with the rest of your logic
      const users = await User.find({ companyCode: decoded.companyCode });
      res.status(200).json(users);
    });
  } catch (error) {
    console.error("Error retrieving users:", error.message);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
});
// Get User by Id
router.get("/users/:id", async (req, res) => {
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
router.patch("/users/:id", async (req, res) => {
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
router.delete("/users/:id", async (req, res) => {
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