const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const Company = require("../model/companySchema"); 
const { authenticateJWT } = require("../middleware/authMiddleware");
const router = express.Router();
const {
  validateRefreshToken,
  getUserFromRefreshToken,
} = require("./authHelpers");


const generateToken = (account) => {
  const secretKey = process.env.JWT_SECRET;
  const payload = {
    id: account._id,
    username: account.username,
    isCompany: !!account.companyCode,
  };
  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
};




router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token is required" });
  }

  try {
    const isValid = validateRefreshToken(refreshToken);
    if (!isValid) {
      return res
        .status(401)
        .json({ error: "Invalid or expired refresh token" });
    }

    const userData = getUserFromRefreshToken(refreshToken);
    const newAccessToken = jwt.sign(
      {
        id: userData.id,
        username: userData.username,
        isCompany: userData.isCompany,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Adjust token expiry as needed
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Error in refresh token endpoint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.post("/register", async (req, res) => {
  const { firstName, lastName, email, username, password, companyCode } =
    req.body;

  // Validate the input data
  const validationError = validateRegistrationData(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    // Check if username or email already exists
    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
      return res.status(409).json({
        error:
          userExists.username === username
            ? "Username already taken"
            : "Email already in use",
      });
    }

    // Check if the company code exists
    if (!(await Company.exists({ companyCode }))) {
      return res.status(400).json({ error: "Invalid company code" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
      companyCode,
    });
    await newUser.save();

    // Send success response
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
  try {
    const collection = isCompany ? Company : User;
    const account = await collection.findOne({ username }).select("+password");

    if (!account || !(await bcrypt.compare(password, account.password))) {
      return res.status(401).send({ error: "Invalid credentials" });
    }

    const tokenPayload = {
      id: account._id,
      username: account.username,
      isCompany,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const responsePayload = {
      token,
      isCompany,
      ...(isCompany
        ? {
            companyData: {
              // Encapsulating company data
              companyName: account.companyName,
              companyAddress: account.companyAddress,
              companyEmail: account.companyEmail,
              phoneNumber: account.phoneNumber,
            },
          }
        : {
            user: {
              firstName: account.firstName,
              lastName: account.lastName,
              email: account.email,
            },
          }),
    };

    res.json(responsePayload);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

router.post("/create-election", async (req, res) => {
  try {
    const {
      electionName,
      electionType,
      electionStartDate,
      electionEndDate,
      electionDesc,
      candidates,
    } = req.body;

    if (
      !electionName ||
      !electionType ||
      !electionStartDate ||
      !electionEndDate ||
      !electionDesc
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const candidateErrors = [];
    for (const candidateId of candidates) {
      const candidateExists = await User.exists({ _id: candidateId });
      if (!candidateExists) {
        candidateErrors.push(`Invalid candidate with ID: ${candidateId}`);
      }
    }
    if (candidateErrors.length > 0) {
      return res.status(400).json({ error: candidateErrors.join(", ") });
    }

    const newElection = new Election({
      electionName,
      electionType,
      electionStartDate,
      electionEndDate,
      electionDesc,
      candidates: candidates.map((candidateId) => ({ user: candidateId })),
    });

    await newElection.save();
    res
      .status(201)
      .json({
        message: "Election created successfully",
        election: newElection,
      });
  } catch (error) {
    console.error("Error creating election:", error);
    res
      .status(500)
      .json({ error: "Failed to create election. " + error.message });
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
    const usernameExists = await Company.exists({ username });
    const companyCodeExists = await Company.exists({ companyCode });

    if (usernameExists || companyCodeExists) {
      return res.status(400).json({
        error: usernameExists
          ? "Username already taken"
          : "Company code already taken",
      });
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

    const companyResponse = {
      ...newCompany.toJSON(),
      password: undefined,
    };

    res.status(201).json({ company: companyResponse, token });
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
      password: hashedPassword, 
      token: hashedToken, 
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
