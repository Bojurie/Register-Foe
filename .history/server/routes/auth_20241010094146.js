const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../model/User')
const Company = require('../model/companySchema')
const { authenticateJWT } = require('../middleware/authMiddleware')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: "uploads/" });
const { check, validationResult } = require("express-validator");




const {
  validateRefreshToken,
  getUserFromRefreshToken,
  } = require('./authHelpers')
  
const { generateToken } = require('../utils/authUtils')

router.post('/token', async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' })
  }
  try {
    const userId = validateRefreshToken(refreshToken)
    if (!userId) {
      return res.status(403).json({ error: 'Invalid refresh token' })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const newAccessToken = jwt.sign(
      { sub: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } 
    )

    res.json({ accessToken: newAccessToken })
  } catch (error) {
    console.error('Error in /token route:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// router.post("/refresh", async (req, res) => {
//   const { refreshToken } = req.body;
//   if (!refreshToken) {
//     return res.status(400).json({ error: "Refresh token is required" });
//   }
//   try {
//     const isValid = validateRefreshToken(refreshToken);
//     if (!isValid) {
//       return res
//         .status(401)
//         .json({ error: "Invalid or expired refresh token" });
//     }
//     const userData = getUserFromRefreshToken(refreshToken);
//     const newAccessToken = jwt.sign(
//       {
//         id: userData.id,
//         username: userData.username,
//         isCompany: userData.isCompany,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );
//     res.json({ accessToken: newAccessToken });
//   } catch (error) {
//     console.error("Error in refresh token endpoint:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });











const getUser = async (username, isCompany) => {
  const Model = isCompany ? Company : User;
  return Model.findOne({ username: username.trim() });
};

// REGISTER ROUTE FOR BOTH COMPANIES AND USERS
router.post("/register", async (req, res) => {
  try {
    const { type, ...data } = req.body;

    if (!type) {
      console.error("No type provided in the registration request.");
      return res.status(400).json({ error: "Invalid registration type." });
    }

    if (type === "company") {
      if (!data.companyName || !data.username) {
        console.error("Missing required company registration data.");
        return res
          .status(400)
          .json({ error: "Missing required company registration data." });
      }

      const companyExists = await Company.findOne({
        $or: [{ companyName: data.companyName }, { username: data.username }],
      });
      if (companyExists) {
        console.error("Company already exists.");
        return res
          .status(409)
          .json({
            error: "Company already exists with the provided name or username.",
          });
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const newCompany = await Company.create({
        ...data,
        password: hashedPassword,
        role: "Admin",
        isCompany: true,
      });

      return res.status(201).json({
        message: "Company registered successfully.",
        companyId: newCompany._id,
      });
    } else if (type === "user") {
      if (!data.username || !data.email) {
        console.error("Missing required user registration data.");
        return res
          .status(400)
          .json({ error: "Missing required user registration data." });
      }

      const userExists = await User.findOne({
        $or: [{ username: data.username }, { email: data.email }],
      });
      if (userExists) {
        console.error("User already exists.");
        return res
          .status(409)
          .json({
            error: "User already exists with the provided username or email.",
          });
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const age = calculateAge(new Date(data.dob));

      const newUser = await User.create({
        ...data,
        password: hashedPassword,
        role: "User",
        isCompany: false,
        age,
      });

      const token = generateToken({
        _id: newUser._id,
        username: newUser.username,
        role: newUser.role,
      });
      return res.status(201).json({
        message: "User registered successfully.",
        userId: newUser._id,
        token,
      });
    } else {
      console.error("Invalid registration type.");
      return res.status(400).json({ error: "Invalid registration type." });
    }
  } catch (error) {
    console.error("Error in registration:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});
function calculateAge(dob) {
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}



// LOGIN FOR ALL USERS


router.post("/login", async (req, res) => {
  const { username, password, isCompany } = req.body;

  try {
    const account = await getUser(username, isCompany);

    if (!account || !(await bcrypt.compare(password, account.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const tokenPayload = {
      _id: account._id,
      username: account.username,
      isCompany,
      role: account.role,
    };

    const token = generateToken(tokenPayload);

    const userResponse = isCompany
      ? {
          _id: account._id,
          companyName: account.companyName,
          companyAddress: account.companyAddress,
          companyEmail: account.companyEmail,
          phoneNumber: account.phoneNumber,
          companyCode: account.companyCode,
          isCompany: true,
        }
      : {
          _id: account._id,
          firstName: account.firstName,
          lastName: account.lastName,
          age: account.age,
          sex: account.sex,
          email: account.email,
          companyCode: account.companyCode,
          userProfileImage: account.userProfileImage,
          userProfileDetail: account.userProfileDetail,
          isCompany: false,
        };

    res.json({ token, user: userResponse });
  } catch (error) {
    console.error("Login process error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});





router.post('/create-election', async (req, res) => {
  try {
    const {
      electionName,
      electionType,
      electionStartDate,
      electionEndDate,
      electionDesc,
      candidates
    } = req.body

    if (
      !electionName ||
      !electionType ||
      !electionStartDate ||
      !electionEndDate ||
      !electionDesc
    ) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    const candidateErrors = []
    for (const candidateId of candidates) {
      const candidateExists = await User.exists({ _id: candidateId })
      if (!candidateExists) {
        candidateErrors.push(`Invalid candidate with ID: ${candidateId}`)
      }
    }
    if (candidateErrors.length > 0) {
      return res.status(400).json({ error: candidateErrors.join(', ') })
    }

    const newElection = new Election({
      electionName,
      electionType,
      electionStartDate,
      electionEndDate,
      electionDesc,
      candidates: candidates.map(candidateId => ({ user: candidateId }))
    })

    await newElection.save()
    res.status(201).json({
      message: 'Election created successfully',
      election: newElection
    })
  } catch (error) {
    console.error('Error creating election:', error)
    res
      .status(500)
      .json({ error: 'Failed to create election. ' + error.message })
  }
})




// Company Registration
router.post('/register', async (req, res) => {
  const {
    companyName,
    username,
    password,
    companyAddress,
    CompanyEmail,
    phoneNumber,
    companyPhotoUrl,
    companyCode
  } = req.body

  try {
    const usernameExists = await Company.exists({ username })
    const companyCodeExists = await Company.exists({ companyCode })

    if (usernameExists || companyCodeExists) {
      return res.status(400).json({
        error: usernameExists
          ? 'Username already taken'
          : 'Company code already taken'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newCompany = new Company({
      companyName,
      username,
      password: hashedPassword,
      companyAddress,
      CompanyEmail,
      phoneNumber,
      companyPhotoUrl,
      companyCode
    })

    await newCompany.save()

    const token = generateToken(newCompany, true)

    const companyResponse = {
      ...newCompany.toJSON(),
      password: undefined
    }

    res.status(201).json({ company: companyResponse, token })
  } catch (error) {
    console.error('Error adding company:', error)
    res.status(500).json({ error: 'Failed to add company' })
  }
})

router.put('/edit-candidate/:id', authenticateJWT, async (req, res) => {
  const candidateId = req.params.id

  try {
    const candidateProfile = await CandidateProfile.findById(candidateId)

    if (!candidateProfile) {
      return res.status(404).json({ error: 'Candidate profile not found' })
    }
    if (candidateProfile.votes > 0) {
      return res
        .status(403)
        .json({ error: 'Cannot edit profile after receiving votes' })
    }

    if (candidateProfile.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: 'Unauthorized to edit this profile' })
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
      electionInfo: req.body.electionInfo
    }

    await CandidateProfile.findByIdAndUpdate(
      candidateId,
      updatedCandidateProfile
    )

    res.json({ message: 'Candidate profile updated successfully' })
  } catch (error) {
    console.error('Error updating candidate profile:', error)
    res.status(500).json({ error: 'Failed to update candidate profile' })
  }
})


router.delete('/delete-candidate/:id', authenticateJWT, async (req, res) => {
  const candidateId = req.params.id

  try {
    const candidateProfile = await CandidateProfile.findById(candidateId)

    if (!candidateProfile) {
      return res.status(404).json({ error: 'Candidate profile not found' })
    }

    if (candidateProfile.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: 'Unauthorized to delete this profile' })
    }

    if (candidateProfile.votes > 0) {
      return res
        .status(403)
        .json({ error: 'Cannot delete profile after receiving votes' })
    }

    await CandidateProfile.findByIdAndRemove(candidateId)

    res.json({ message: 'Candidate profile deleted successfully' })
  } catch (error) {
    console.error('Error deleting candidate profile:', error)
    res.status(500).json({ error: 'Failed to delete candidate profile' })
  }
})

module.exports = router
