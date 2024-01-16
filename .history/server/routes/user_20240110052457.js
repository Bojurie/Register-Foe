const express = require("express");
const router = express.Router();
const User = require("../model/User"); // Import the User model
const verifyToken =  require("./verifyToken");
const mongoose = require("mongoose");


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




router.get(
  "/users/byCompanyCode/:companyCode",
  verifyToken,
  async (req, res) => {
    try {
      const { companyCode } = req.params;
      if (!companyCode) {
        return res.status(400).json({ error: "Company code is required" });
      }

      const users = await User.find({ companyCode });
      if (!users.length) {
        return res
          .status(404)
          .json({ error: "No users found for this company code" });
      }
      res.status(200).json(users);
    } catch (error) {
      console.error("Error retrieving users by company code:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);





// Get User by Id
router.get("/users/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -otherSensitiveField"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" }); 
    }
    res.status(200).json(user); 
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message }); 
  }
});




//checkAdmin verifyToken, isAdmin, 
router.put("/user/:userId/role", async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    console.log("UserId:", userId); // Debugging

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    // Role Validation
    const validRoles = ["Admin", "User" /* other valid roles */];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Update logic
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User role updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error in updateUserRole:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


//isAuthenticated, isAdmin,
router.get("/users/admins",  async (req, res) => {
  try {
    const { companyCode } = req.query;

    if (!companyCode) {
      return res.status(400).json({ error: "Company code is required" });
    }

    // Fetch admin users from the database
    const adminUsers = await User.find({
      companyCode: companyCode,
      role: "Admin",
    });

    res.json(adminUsers); // Send the list of admin users as a response
  } catch (error) {
    console.error("Error fetching admin users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/users/validate-token", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ valid: false, error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ valid: false, error: "Invalid token" });
    }

    // Optionally, you can add additional checks or logic here
    // For example, checking if the user still exists in the database

    res.status(200).json({ valid: true });
  });
});


//Update User
router.patch("/updateAdminStatus/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const isAdmin = req.body.isAdmin;

    // Ensure the user making the request has the authority to change admin status
    // ... Authorization logic here ...

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isAdmin },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user admin status:", error);
    res.status(500).json({ error: "Failed to update user admin status" });
  }
});

router.post("/users/vote", async (req, res) => {
  const { userId, electionId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.votedElections.includes(electionId)) {
      return res
        .status(400)
        .json({ error: "User has already voted in this election" });
    }

    user.likesCount = (user.likesCount || 0) + 1;
    user.votedElections.push(electionId);
    await user.save();

    res
      .status(200)
      .json({
        message: "Vote successfully counted",
        likesCount: user.likesCount,
      });
  } catch (error) {
    console.error("Error in user vote endpoint:", error);
    res.status(500).json({ error: "Internal server error" });
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