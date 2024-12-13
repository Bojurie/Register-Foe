const express = require("express");
const router = express.Router();
const User = require("../model/User"); // Import the User model
const verifyToken =  require("./verifyToken");
const mongoose = require("mongoose");
const Election = require("../model/electionModel");


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


router.get("/users/:id", verifyToken, async (req, res) => {
  try {
    let userId = req.params.id;
    if (typeof userId === "object") {
      userId = userId._id;
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findById(userId).select(
      "-password -otherSensitiveField"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});






// Get User by Id
router.get("/users/:id", async (req, res) => {
  const { id: userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID format" });
  }
  try {
    const user = await User.findById(userId).select("-password -otherSensitiveFields");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});








// Give and Take Admin previledges
router.put("/user/:userId/role", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    if (!role || typeof role !== "string") {
      return res
        .status(400)
        .json({ message: "Role is required and must be a string" });
    }

    const validRoles = ["Admin", "User"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    console.info(`User role updated successfully: ${userId} -> ${role}`);

    res.json({
      message: `User role updated to ${role} successfully`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in updateUserRole:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Route to handle liking a user profile
router.post("/users/:userId/like", verifyToken, async (req, res) => {
  const { userId } = req.params; // The user ID whose profile is being liked
  const likerId = req.user._id; // The ID of the user who is liking the profile

  try {
    // Fetch the user whose profile is being liked
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure that a user cannot like their own profile
    if (user._id.equals(likerId)) {
      return res.status(400).json({ message: "You cannot like your own profile" });
    }

    // Increment the profileLikes count
    user.profileLikes += 1;
    await user.save();

    // Return the updated like count
    res.status(200).json({
      message: "Profile liked successfully",
      profileLikes: user.profileLikes,
    });
  } catch (error) {
    console.error("Error in liking profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});




//isAuthenticated, isAdmin,
router.get("/admins/:companyCode", async (req, res) => {
  const { companyCode } = req.params;

  if (!companyCode) {
    return res.status(400).json({ error: "Company code is required." });
  }

  try {
    const admins = await User.find({ companyCode, role: "Admin" }).select(
      "-password"
    );
    res.json({ data: admins });
  } catch (error) {
    console.error("Error fetching admin users:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});




router.get("/validate-token", verifyToken, (req, res) => {
  res.json({ valid: true });
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