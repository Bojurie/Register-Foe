const express = require("express");
const router = express.Router();
const User = require("../model/User"); // Import the User model
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





const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header is missing" });
    }

    const token = authHeader.split(" ")[1]; // Assuming Bearer token
    if (!token) {
      return res.status(401).json({ error: "Bearer token is missing" });
    }

    // Verifying and decoding the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ error: "Token has expired" });
        }
        return res.status(401).json({ error: "Invalid token" });
      }

      // Additional role/type checks if necessary
      if (decoded.isCompany !== true) {
        return res
          .status(403)
          .json({ error: "Access restricted to company users" });
      }

      // Assign the decoded token to the request object
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error("Error in token verification:", error.message);
    res.status(500).json({ error: "Server error during token verification" });
  }
};


// Example usage of the middleware in a route
router.get("/users/byCompanyCode", verifyToken, async (req, res) => {
  try {
    if (!req.user.isCompany) {
      return res
        .status(403)
        .json({ error: "Access denied: Company rights required" });
    }

    const users = await User.find({ companyCode: req.user.companyCode });
    res.status(200).json(users);
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