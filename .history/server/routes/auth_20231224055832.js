const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const Company = require("../model/companySchema"); 
const { authenticateJWT } = require("../middleware/authMiddleware");
const router = express.Router();


const generateToken = (account) => {
  const secretKey = process.env.JWT_SECRET;
  const payload = {
    id: account._id,
    username: account.username,
    isCompany: !!account.companyCode,
  };
  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
};

// User Registration
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, username, password, companyCode } =
    req.body;

  try {
    if (await User.exists({ username })) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      username,
      password: await bcrypt.hash(password, 10),
      companyCode,
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "User registered successfully. Please log in." });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password, isCompany } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    let account;
    let collection = isCompany ? Company : User;

    account = await collection.findOne({ username }).select("+password");

    if (!account) {
      return res.status(401).json({ error: "Account not found" });
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const tokenPayload = {
      id: account._id,
      username: account.username,
      isCompany: isCompany,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Construct userResponse
    const userResponse = isCompany
      ? {
          _id: account._id,
          username: account.username,
          companyName: account.companyName,
          companyAddress: account.companyAddress,
          companyEmail: account.companyEmail,
          phoneNumber: account.phoneNumber,
          companyPhotoUrl: account.companyPhotoUrl,
          isCompany: isCompany,
          token: token,
        }
      : {
          _id: account._id,
          username: account.username,
          firstName: account.firstName,
          lastName: account.lastName,
          email: account.email,
          isCompany: isCompany,
          token: token,
        };

    res.json({ user: userResponse });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Company Registration
router.post("/company/register", async (req, res) => {
  const {
    companyName,
    username,
    password,
    companyAddress,
    CompanyEmail,
    phoneNumber,
    companyPhotoUrl,
    companyCode,
  } = req.body;

  try {
    if (await Company.exists({ companyCode })) {
      return res.status(400).json({ error: "Company code already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCompany = new Company({
      companyName,
      username,
      password: hashedPassword,
      companyAddress,
      CompanyEmail,
      phoneNumber,
      companyPhotoUrl,
      companyCode,
    });

    await newCompany.save();
    const token = generateToken(newCompany);
    res.status(201).json({ company: newCompany.toJSON(), token });
  } catch (error) {
    console.error("Error adding company:", error);
    res.status(500).json({ error: "Failed to add company" });
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
