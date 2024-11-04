const express = require("express");
const router = express.Router();
const User = require("../model/User"); 
const verifyToken =  require("./verifyToken");
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator"); 


//Create User
router.post(
  "/users",
  [
    check("email").isEmail().withMessage("Invalid email format"),
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
    check("firstName").notEmpty().withMessage("First name is required"),
    check("lastName").notEmpty().withMessage("Last name is required"),
    check("companyCode").notEmpty().withMessage("Company code is required"),
    check("dob").isDate().withMessage("Valid date of birth is required"),
    check("username").notEmpty().withMessage("Username is required"),
    check("userProfileDetail")
      .notEmpty()
      .withMessage("Profile detail is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      email,
      password,
      firstName,
      lastName,
      companyCode,
      username,
      dob,
      sex,
      userProfileImage,
      userProfileDetail,
      role,
    } = req.body;

    try {
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "User with this email or username already exists" });
      }

      const companyExists = await Company.exists({ companyCode });
      if (!companyExists) {
        return res
          .status(400)
          .json({ error: `No company found with code ${companyCode}` });
      }

      const user = new User({
        email,
        password, 
        firstName,
        lastName,
        companyCode,
        username,
        dob,
        sex,
        userProfileImage,
        userProfileDetail,
        role: role || "User", 
      });

      await user.save();

      const token = jwt.sign(
        { _id: user._id, isCompany: false }, 
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(201).json({
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          companyCode: user.companyCode,
          username: user.username,
          dob: user.dob,
          sex: user.sex,
          userProfileImage: user.userProfileImage,
          role: user.role,
          profileLikes: user.profileLikes,
          votesCount: user.votesCount,
          hiredDate: user.hiredDate,
        },
        token,
      });
    } catch (error) {
      console.error("User registration failed:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);




router.get(
  "/users/byCompanyCode/:companyCode",
  verifyToken,
  async (req, res) => {
    const { companyCode: requestedCompanyCode } = req.params;
    const { companyCode: userCompanyCode, role, isCompany } = req.user;

    // Validate the presence of the company code in request params
    if (!requestedCompanyCode) {
      return res.status(400).json({ error: "Company code is required" });
    }

    try {
      // Ensure only users from the same company, company users, or admins can access this data
      if (
        requestedCompanyCode !== userCompanyCode &&
        role !== "Admin" &&
        !isCompany
      ) {
        return res.status(403).json({
          error: "You do not have access to this company's users.",
        });
      }

      // Fetch users by company code
      const users = await User.find({
        companyCode: requestedCompanyCode,
      }).lean();

      // If users are found, return users and the total count
      if (users.length > 0) {
        const usersWithVirtuals = users.map((user) => ({
          ...user,
          birthdayCountdown: user.birthdayCountdown
            ? `${user.birthdayCountdown} days until birthday`
            : null,
          isNewHire: user.isNewHire ? "New Hire" : null,
          anniversaryCountdown: user.anniversaryCountdown
            ? `${user.anniversaryCountdown} days until anniversary`
            : null,
        }));

        return res.status(200).json({
          totalUsers: users.length, // Total number of users
          users: usersWithVirtuals,
        });
      }

      // If no users are found, return 0 users
      return res.status(200).json({
        totalUsers: 0,
        users: [],
        message: "No users found for this company code",
      });
    } catch (error) {
      console.error("Error retrieving users by company code:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);













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

// PROFILE LIKES
router.post("/users/:userId/like", verifyToken, async (req, res) => {
  const { userId } = req.params;
  const likerId = req.user._id;

  try {
    if (userId === likerId.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot like your own profile" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.likedBy.includes(likerId)) {
      return res
        .status(400)
        .json({ message: "You have already liked this profile" });
    }

    user.profileLikes = (user.profileLikes || 0) + 1;
    user.likedBy.push(likerId);
    await user.save();

    return res.status(200).json({
      message: "Profile liked successfully",
      profileLikes: user.profileLikes,
    });
  } catch (error) {
    console.error("Error in liking profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});





//isAuthenticated, isAdmin,
router.get("/admins/:companyCode", async (req, res) => {
  const { companyCode } = req.params;

  if (!companyCode) {
    return res.status(400).json({ error: "Company code is required." });
  }

  try {
    const admins = await User.find({ companyCode, role: "Admin" })
      .select("-password") 
      .lean(); 

    if (!admins.length) {
      return res
        .status(404)
        .json({ error: "No admins found for this company." });
    }

    res.status(200).json({ data: admins });
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