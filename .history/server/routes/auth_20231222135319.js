const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const CandidateProfile = require("../model/candidateProfileSchema");
const Election = require("../model/electionModel");
const { authenticateJWT, isAdmin } = require("../middleware/authMiddleware");
const { generateToken } = require("../utils/authUtils");
const router = express.Router();


router.post("/register", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    username,
    password,
    isAdmin,
    adminCode,
    companyCode,
  } = req.body;

  try {
    if (await User.exists({ username })) {
      return res.status(400).json({ error: "Username already taken" });
    }

    if (isAdmin && !isValidAdminCode(adminCode)) {
      return res.status(400).json({ error: "Invalid admin code" });
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      username,
      password: await bcrypt.hash(password, 10),
      isAdmin,
      adminCode: isAdmin ? adminCode : undefined,
      companyCode,
    });

    await newUser.save();
    const token = generateToken(newUser);
    res.status(201).json({ ...newUser.toJSON(), token });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

function isValidAdminCode(code) {
  return /^\d{5}$/.test(code);
}

// Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken({
      id: user._id,
      username: user.username,
      isAdmin: user.isAdmin,
    });
    res.json({ user: user.toJSON(), token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.post("/register-candidate", authenticateJWT, async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      party,
      pastAccomplishments,
      promises,
      dateOfBirth,
      phoneNumber,
      address,
      politicalParty,
      campaignWebsite,
      biography,
      profileImage,
      socialMedia,
      electionInfo,
    } = req.body;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Get the authenticated user from the request
    const user = req.user;

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });

    const hashedToken = await bcrypt.hash(token, 10);

    const newCandidateProfile = new CandidateProfile({
      user: user._id,
      fullName,
      party,
      pastAccomplishments,
      promises,
      dateOfBirth,
      email,
      phoneNumber,
      address,
      politicalParty,
      campaignWebsite,
      biography,
      profileImage,
      socialMedia,
      electionInfo,
      password: hashedPassword, // Store the hashed password
      token: hashedToken, // Store the hashed token
    });

    await newCandidateProfile.save();

    res.status(201).json({ message: "Candidate profile created successfully" });
  } catch (error) {
    console.error("Error creating candidate profile:", error);
    res.status(500).json({ error: "Failed to create candidate profile" });
  }
});
router.put("/edit-candidate/:id", authenticateJWT, async (req, res) => {
  const candidateId = req.params.id;

  try {
    const candidateProfile = await CandidateProfile.findById(candidateId);

    if (!candidateProfile) {
      return res.status(404).json({ error: "Candidate profile not found" });
    }
    if (candidateProfile.votes > 0) {
      return res
        .status(403)
        .json({ error: "Cannot edit profile after receiving votes" });
    }

    // Ensure that only the authenticated user can edit their profile
    if (candidateProfile.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Unauthorized to edit this profile" });
    }

    const updatedCandidateProfile = {
      fullName: req.body.fullName,
      party: req.body.party,
      pastAccomplishments: req.body.pastAccomplishments,
      promises: req.body.promises,
      dateOfBirth: req.body.dateOfBirth,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      politicalParty: req.body.politicalParty,
      campaignWebsite: req.body.campaignWebsite,
      biography: req.body.biography,
      profileImage: req.body.profileImage,
      socialMedia: req.body.socialMedia,
      electionInfo: req.body.electionInfo,
    };

    // Update the candidate profile
    await CandidateProfile.findByIdAndUpdate(
      candidateId,
      updatedCandidateProfile
    );

    res.json({ message: "Candidate profile updated successfully" });
  } catch (error) {
    console.error("Error updating candidate profile:", error);
    res.status(500).json({ error: "Failed to update candidate profile" });
  }
});

router.delete("/delete-candidate/:id", authenticateJWT, async (req, res) => {
  const candidateId = req.params.id;

  try {
    const candidateProfile = await CandidateProfile.findById(candidateId);

    if (!candidateProfile) {
      return res.status(404).json({ error: "Candidate profile not found" });
    }

    // Ensure that only the authenticated user can delete their profile
    if (candidateProfile.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this profile" });
    }

    if (candidateProfile.votes > 0) {
      return res
        .status(403)
        .json({ error: "Cannot delete profile after receiving votes" });
    }

    await CandidateProfile.findByIdAndRemove(candidateId);

    res.json({ message: "Candidate profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting candidate profile:", error);
    res.status(500).json({ error: "Failed to delete candidate profile" });
  }
});

module.exports = router;
