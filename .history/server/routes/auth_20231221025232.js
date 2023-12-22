const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../model/User");
const CandidateProfile = require("../model/candidateProfileSchema");
const { generateToken } = require("../utils/authUtils");

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;

    if (await User.exists({ username })) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
    });

    const token = generateToken(newUser);
    return res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      firstName: newUser.firstName,
      password: newUser.hashedPassword,
      createdAt: newUser.createdAt,
      token,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);
    return res.json({ user: { id: user.id,  username: user.username , password: user.hashedPassword, firstName: user.firstName, lastName: user.lastName}, token });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});



router.post("/register-candidate", async (req, res) => {
  try {
    const {
      user,
      fullName,
      party,
      pastAccomplishments,
      promises,
      likes,
      votes,
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
    } = req.body;

    // Create a new candidate profile document using the Mongoose model
    const newCandidateProfile = new CandidateProfile({
      user,
      fullName,
      party,
      pastAccomplishments,
      promises,
      likes,
      votes,
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
    });

    // Save the new candidate profile to the database
    await newCandidateProfile.save();

    res.status(201).json({ message: "Candidate profile created successfully" });
  } catch (error) {
    console.error("Error creating candidate profile:", error);
    res.status(500).json({ error: "Failed to create candidate profile" });
  }
});


module.exports = router;
