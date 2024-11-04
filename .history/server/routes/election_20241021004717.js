const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Election = require("../model/electionModel");
const User = require("../model/User");
const verifyToken = require("./verifyToken");
const createUniqueElection = require("../utils/helper");
const Candidate = require("../model/candidate");
const { v4: uuidv4 } = require("uuid");



const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// CREATE A NEW ELECTION
router.post("/create-election", verifyToken, async (req, res) => {
  if (!req.user.isCompany && !req.user.isAdmin) {
    return res
      .status(403)
      .json({ message: "You do not have permission to create an election." });
  }

  const { candidates, ...electionData } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!Array.isArray(candidates) || candidates.length === 0) {
      throw new Error("Candidates array cannot be empty");
    }

    const validCandidateIds = candidates.filter((id) =>
      mongoose.isValidObjectId(id)
    );
    if (validCandidateIds.length !== candidates.length) {
      throw new Error("Some candidate IDs are invalid");
    }

    const candidateDocs = await User.find({ _id: { $in: validCandidateIds } });
    if (candidateDocs.length !== validCandidateIds.length) {
      throw new Error("Some candidate IDs do not match existing users");
    }

    if (
      !electionData.title ||
      !electionData.electionType ||
      !electionData.startDate ||
      !electionData.endDate
    ) {
      throw new Error(
        "All required election fields (title, electionType, startDate, endDate) must be provided."
      );
    }

    const newElection = new Election({
      ...electionData,
      electionId: uuidv4(), // Generate unique ID for the election
    });

    await newElection.save({ session });

    const newCandidates = await Promise.all(
      candidateDocs.map((user) =>
        new Candidate({
          user: user._id,
          election: newElection._id,
        }).save({ session })
      )
    );

    newElection.candidates = newCandidates.map((candidate) => candidate._id);
    await newElection.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Election created successfully",
      election: newElection,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Error processing create election request:", error);

    res.status(500).json({
      error: error.message || "Failed to create election.",
    });
  }
});



// GET ALL ELECTION WITH CANDIDATE DETAILS

router.get("/elections", verifyToken, async (req, res) => {
  try {
    const { companyCode: userCompanyCode, role } = req.user; 
    const currentDate = new Date();

    const elections = await Election.find({
      companyCode: userCompanyCode,
      endDate: { $gt: currentDate }, 
    }).populate({
      path: "candidates",
      populate: {
        path: "user",
        model: "User",
        select:
          "firstName lastName age sex role userProfileDetail userProfileImage votesCount", // Select only relevant fields
      },
    });

    if (!elections || elections.length === 0) {
      return res
        .status(404)
        .json({ message: "No elections found for your company." });
    }

    const formattedElections = elections.map((election) => ({
      ...election._doc,
      candidates: election.candidates.map((candidate) => ({
        ...candidate._doc,
        user: candidate.user
          ? {
              id: candidate.user._id,
              firstName: candidate.user.firstName,
              lastName: candidate.user.lastName,
              age: candidate.user.age,
              sex: candidate.user.sex,
              role: candidate.user.role,
              userProfileDetail: candidate.user.userProfileDetail,
              userProfileImage: candidate.user.userProfileImage,
              votesCount: candidate.votes,
            }
          : null, // Handle case where user data might be null
      })),
    }));

    return res.json(formattedElections);
  } catch (error) {
    console.error("Error fetching elections:", error);
    return res.status(500).json({ message: "Server error" });
  }
});









// router.get("/elections", async (req, res) => {
//   try {
//     const currentDate = new Date();

//     const elections = await Election.find({
//       endDate: { $gt: currentDate },
//     }).populate({
//       path: "candidates",
//       populate: {
//         path: "user",
//         model: "User",
//         select:
//           "firstName lastName age sex role userProfileDetail userProfileImage votesCount",
//       },
//     });

//     const formattedElections = elections.map((election) => ({
//       ...election._doc,
//       candidates: election.candidates.map((candidate) => ({
//         ...candidate._doc,
//         user: candidate.user
//           ? {
//               id: candidate.user._id,
//               firstName: candidate.user.firstName,
//               lastName: candidate.user.lastName,
//               age: candidate.user.age,
//               sex: candidate.user.sex,
//               role: candidate.user.role,
//               userProfileDetail: candidate.user.userProfileDetail,
//               userProfileImage: candidate.user.userProfileImage,
//               votesCount: candidate.votes,
//             }
//           : null,
//       })),
//     }));

//     res.json(formattedElections);
//   } catch (error) {
//     console.error("Error fetching elections:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });












// GET PAST ELECTION ADMIN AND USER
router.get("/elections/past/:companyCode", verifyToken, async (req, res) => {
  try {
    const { companyCode: requestedCompanyCode } = req.params;
    const {
      companyCode: userCompanyCode,
      role,
      _id: userId,
      isCompany,
    } = req.user;

    const currentDate = new Date();

    if (!requestedCompanyCode) {
      return res.status(400).json({ message: "Company code is required." });
    }

    if (requestedCompanyCode !== userCompanyCode && role !== "Admin") {
      return res.status(403).json({
        error: "You do not have access to this company's elections.",
      });
    }

    const electionQuery = {
      companyCode: requestedCompanyCode,
      endDate: { $lt: currentDate },
    };

    if (!isCompany && role !== "Admin") {
      electionQuery.$or = [
        { "candidates.user": userId },
        { "candidates.voters": userId },
      ];
    }

    const elections = await Election.find(electionQuery)
      .populate({
        path: "candidates.user",
        select: "firstName lastName",
      })
      .lean(); 

    if (!elections.length) {
      return res.status(200).json({
        elections: [],
        message: "No past elections found for this company.",
      });
    }

    const electionsWithDetails = elections.map((election) => {
      const totalVotes = election.candidates?.reduce(
        (acc, candidate) => acc + (candidate.votesCount || 0),
        0
      );

      const winningCandidate = election.candidates?.reduce((prev, current) =>
        (prev.votesCount || 0) > (current.votesCount || 0) ? prev : current
      );

      return {
        ...election,
        totalVotes,
        winningCandidate: winningCandidate?.user
          ? {
              id: winningCandidate.user._id,
              firstName: winningCandidate.user.firstName,
              lastName: winningCandidate.user.lastName,
              votesCount: winningCandidate.votesCount || 0,
            }
          : null,
      };
    });

    return res.status(200).json({ elections: electionsWithDetails });
  } catch (error) {
    console.error("Error fetching past elections:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});











// GET ELECTION BY ELCTION ID 
// router.get("/upcoming-elections/:electionId", verifyToken, async (req, res) => {
//   const { electionId } = req.params;

//   if (!mongoose.isValidObjectId(electionId)) {
//     return res.status(400).json({ error: "Invalid Election ID format" });
//   }

//   try {
//     const election = await Election.findById(electionId).populate({
//       path: "candidates.candidateId",
//       model: "Candidate",
//       populate: {
//         path: "user",
//         model: "User",
//         select: "firstName lastName username",
//       },
//     });

//     if (!election) {
//       return res.status(404).json({ error: "Election not found" });
//     }

//     res.status(200).json(election);
//   } catch (error) {
//     console.error("Error fetching election:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });





// POST ELECTION VOTES FOR CANDIDATE 
router.post("/elections/:electionId/vote", verifyToken, async (req, res) => {
  const { candidateId } = req.body;
  const { electionId } = req.params;
  const userId = req.user._id;

  try {
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    const currentDate = new Date();
    if (
      currentDate < new Date(election.startDate) ||
      currentDate > new Date(election.endDate)
    ) {
      return res
        .status(400)
        .json({ message: "Voting is not allowed at this time" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.votedElections.includes(election._id)) {
      return res
        .status(400)
        .json({ message: "User has already voted in this election" });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    candidate.votes += 1;
    await candidate.save();

    election.totalVotes += 1;
    await election.save();

    user.votedElections.push(election._id);
    await user.save();

    res.status(200).json({
      message: "Vote successfully recorded",
      candidateVotes: candidate.votes,
      totalVotes: election.totalVotes,
    });
  } catch (error) {
    console.error("Error in voting process:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});













// GET CANDIDATE PERCENTAGE
router.get(
  "/elections/:electionId/candidate/:candidateId/percentage",
  async (req, res) => {
    try {
      const { electionId, candidateId } = req.params;

      const election = await Election.findById(electionId);

      if (!election) {
        return res.status(404).json({ error: "Election not found" });
      }

      const percentage = election.getCandidatePercentage(candidateId);
      res.status(200).json({ percentage });
    } catch (error) {
      console.error("Error fetching candidate percentage:", error.message);
      res.status(500).json({ error: error.message });
    }
  }
);


// GET ELECTION BY COMPANY CODE 

router.get("/elections/:companyCode", verifyToken, async (req, res) => {
  const { companyCode: requestedCompanyCode } = req.params;
  const { companyCode: userCompanyCode, role } = req.user;

  if (!requestedCompanyCode) {
    return res.status(400).json({ error: "Company code is required." });
  }

  try {
    if (requestedCompanyCode !== userCompanyCode && role !== "Admin") {
      return res
        .status(403)
        .json({ error: "You do not have access to this company's elections." });
    }

    const currentDate = new Date();

    const elections = await Election.find({
      companyCode: requestedCompanyCode,
      endDate: { $gt: currentDate },
    })
      .populate({
        path: "candidates.candidateId",
        model: "User",
        select: "firstName lastName",
      })
      .lean();

    if (!elections.length) {
      return res.status(200).json({
        elections: [],
        message: "No upcoming elections found for this company.",
      });
    }

    const electionsWithCandidates = elections.map((election) => {
      const totalVotes = election.candidates.reduce(
        (acc, candidate) => acc + (candidate.voteCount || 0),
        0
      );

      const candidatesWithPercentages = election.candidates.map((candidate) => {
        const votePercentage =
          totalVotes > 0
            ? ((candidate.voteCount / totalVotes) * 100).toFixed(2)
            : "0.00";
        return {
          ...candidate,
          votePercentage,
        };
      });

      return {
        ...election,
        candidates: candidatesWithPercentages,
      };
    });

    return res.status(200).json({ elections: electionsWithCandidates });
  } catch (error) {
    console.error("Error fetching elections by company code:", error.message);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the election data." });
  }
});





// ELECTION CANDIDATE BY ID
// router.get(
//   "/elections/candidates/:electionId",
//   verifyToken,
//   async (req, res) => {
//     try {
//       const { electionId } = req.params;


//       if (!mongoose.isValidObjectId(electionId)) {
//         console.log("Invalid Election ID format:", electionId);
//         return res.status(400).json({ error: "Invalid Election ID format" });
//       }

//       const election = await Election.findById(electionId).populate({
//         path: "candidates",
//         populate: {
//           path: "user",
//           model: "User",
//           select:
//             "firstName lastName age sex role userProfileImage userProfileDetail",
//         },
//       });

//       if (!election) {
//         return res.status(404).json({ error: "Election not found" });
//       }

//       if (!election.candidates || election.candidates.length === 0) {
//         return res
//           .status(404)
//           .json({ error: "No candidates found for this election." });
//       }

//       const candidates = election.candidates
//         .map((candidate) => {
//           const { user } = candidate;
//           if (user) {
//             return {
//               id: user._id,
//               firstName: user.firstName,
//               lastName: user.lastName,
//               age: user.age,
//               sex: user.sex,
//               role: user.role,
//               userProfileDetail: user.userProfileDetail,
//               userProfileImage: user.userProfileImage,
//               votesCount: candidate.votes,
//             };
//           } else {
        
//             return null;
//           }
//         })
//         .filter((candidate) => candidate !== null);

//       res.status(200).json({ candidates });
//     } catch (error) {
//       console.error("Error fetching candidates:", error);
//       res.status(500).json({ error: "Failed to fetch candidates." });
//     }
//   }
// );


// DELETE ELECTION
router.delete("/elections/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { role, isCompany } = req.user; 

  if (role !== "Admin" && !isCompany) {
    return res
      .status(403)
      .json({
        message: "Access denied. Only Admins or Company can delete elections.",
      });
  }

  try {
    const election = await Election.findById(id);

    if (!election) {
      return res.status(404).json({ message: "Election not found." });
    }

    await election.remove();
    res.status(200).json({ message: "Election deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete election." });
  }
});









// Route to get an election by ID with candidates populated
// router.get('/elections/:id', async (req, res) => {
//   try {
//     const election = await Election.findById(req.params.id).populate({
//       path: 'candidates',
//       populate: {
//         path: 'user',
//         model: 'User',
//         select: 'firstName lastName role userProfileImage',
//       },
//     });
//     if (!election) {
//       return res.status(404).json({ message: 'Election not found' });
//     }
//     res.json(election);
//   } catch (error) {
//     console.error('Error fetching election:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// Route to vote in an election
router.post("/election-vote", verifyToken, async (req, res) => {
  try {
    const { electionId, candidateId } = req.body;
    const voterId = req.user._id;

    if (!isValidObjectId(electionId) || !isValidObjectId(candidateId)) {
      return res
        .status(400)
        .json({ error: "Invalid Election or Candidate ID format" });
    }

    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ error: "Election not found" });
    }

    if (election.candidates.some((c) => c.user.equals(voterId))) {
      return res
        .status(403)
        .json({ error: "Candidates cannot vote in their own election" });
    }

    if (election.votes.some((vote) => vote.voter.equals(voterId))) {
      return res.status(403).json({ error: "Voter has already voted" });
    }

    const candidate = election.candidates.find((c) =>
      c.user.equals(candidateId)
    );
    if (!candidate) {
      return res.status(400).json({ error: "Invalid candidate" });
    }

    election.votes.push({ voter: voterId, candidate: candidateId });
    candidate.votes += 1;

    await election.save();
    res.status(200).json({ message: "Vote recorded successfully" });
  } catch (error) {
    console.error("Error processing election vote:", error);
    res.status(500).json({ error: "Failed to process election vote" });
  }
});


module.exports = router;
