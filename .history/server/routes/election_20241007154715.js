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

  // Start transaction
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

    const newElection = new Election({
      ...electionData,
      electionId: uuidv4(),
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







// GET ELECTION BY ELCTION ID 
router.get("/upcoming-elections/:electionId", verifyToken, async (req, res) => {
  const { electionId } = req.params;

  if (!mongoose.isValidObjectId(electionId)) {
    return res.status(400).json({ error: "Invalid Election ID format" });
  }

  try {
    const election = await Election.findById(electionId).populate({
      path: "candidates.candidateId",
      model: "Candidate",
      populate: {
        path: "user",
        model: "User",
        select: "firstName lastName username",
      },
    });

    if (!election) {
      return res.status(404).json({ error: "Election not found" });
    }

    res.status(200).json(election);
  } catch (error) {
    console.error("Error fetching election:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});





// POST ELECTION VOTES FOR CANDIDATE 

router.post("/elections/:electionId/vote", verifyToken, async (req, res) => {
  const { candidateId } = req.body;
  const { electionId } = req.params;
  const userId = req.user._id; // From verifyToken middleware

  try {
    // Check if the election is ongoing
    const election = await Election.findById(electionId);
    if (!election)
      return res.status(404).json({ message: "Election not found" });

    const currentDate = new Date();
    if (currentDate < election.dateStart || currentDate > election.dateEnd) {
      return res
        .status(400)
        .json({ message: "Voting is not allowed at this time" });
    }

    const user = await User.findById(userId);
    if (user.votedElections.includes(electionId)) {
      return res
        .status(400)
        .json({ message: "User has already voted in this election" });
    }

    // Update Candidate's vote count
    const candidate = await Candidate.findById(candidateId);
    if (!candidate)
      return res.status(404).json({ message: "Candidate not found" });

    candidate.votes += 1;
    await candidate.save();

    // Mark that the user has voted in this election
    user.votedElections.push(electionId);
    await user.save();

    res.status(200).json({ message: "Vote successfully recorded", candidate });
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
  const { companyCode } = req.params;

  if (!companyCode) {
    return res.status(400).json({ error: "Company code is required." });
  }

  try {
    const elections = await Election.find({ companyCode })
      .populate({
        path: "candidates.candidateId",
        model: "User",
        select: "firstName lastName",
      })
      .lean(); // Use lean() to get plain JavaScript objects

    if (!elections.length) {
      return res
        .status(404)
        .json({ error: "No elections found for this company code." });
    }

    // Calculate total votes and vote percentages for each election
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
// ELECTION CANDIDATE BY ID
// router.get("/elections/candidates/:electionId", verifyToken, async (req, res) => {
//   try {
//     const { electionId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(electionId)) {
//       return res.status(400).json({ error: "Invalid Election ID format" });
//     }
//     const election = await Election.findById(electionId).populate({
//       path: "candidates.candidateId",
//       model: "User",
//       select: "firstName lastName age userProfileImage votesCount sex role userProfileDetail",
//     });

//     if (!election) {
//       return res.status(404).json({ error: "Election not found" });
//     }

//     if (!election.candidates || election.candidates.length === 0) {
//       return res.status(404).json({ error: "No candidates found for this election." });
//     }
//     const candidates = election.candidates
//       .filter((candidate) => candidate.candidateId) 
//       .map((candidate) => {
//         const candidateData = candidate.candidateId;
//         return {
//           id: candidateData._id,
//           firstName: candidateData.firstName,
//           lastName: candidateData.lastName,
//           age: candidateData.age,
//           sex: candidateData.sex,
//           role: candidateData.role,
//           userProfileDetail: candidateData.userProfileDetail,
//           userProfileImage: candidateData.userProfileImage,
//           votesCount: candidate.voteCount, 
//         };
//       });

//     if (candidates.length === 0) {
//       return res.status(404).json({ error: "No valid candidates found for this election." });
//     }

//     res.status(200).json({ candidates });
//   } catch (error) {
//     console.error("Error fetching candidates:", error);
//     res.status(500).json({ error: "Failed to fetch candidates." });
//   }
// });










// ELECTION CANDIDATE BY ID
router.get(
  "/elections/candidates/:electionId",
  verifyToken,
  async (req, res) => {
    try {
      const { electionId } = req.params;

      console.log("Fetching election with ID:", electionId);

      if (!mongoose.isValidObjectId(electionId)) {
        console.log("Invalid Election ID format:", electionId);
        return res.status(400).json({ error: "Invalid Election ID format" });
      }

      const election = await Election.findById(electionId).populate({
        path: "candidates",
        populate: {
          path: "user",
          model: "User",
          select:
            "firstName lastName age sex role userProfileImage userProfileDetail",
        },
      });

      if (!election) {
        console.log("Election not found for ID:", electionId);
        return res.status(404).json({ error: "Election not found" });
      }

      if (!election.candidates || election.candidates.length === 0) {
        console.log("No candidates found for election ID:", electionId);
        return res
          .status(404)
          .json({ error: "No candidates found for this election." });
      }

      const candidates = election.candidates
        .map((candidate) => {
          const { user } = candidate;
          if (user) {
            return {
              id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              age: user.age,
              sex: user.sex,
              role: user.role,
              userProfileDetail: user.userProfileDetail,
              userProfileImage: user.userProfileImage,
              votesCount: candidate.votes,
            };
          } else {
            console.log(
              "Invalid candidate data found for election:",
              candidate
            );
            return null;
          }
        })
        .filter((candidate) => candidate !== null);

      console.log("Candidates for election ID", electionId, ":", candidates);

      res.status(200).json({ candidates });
    } catch (error) {
      console.error("Error fetching candidates:", error);
      res.status(500).json({ error: "Failed to fetch candidates." });
    }
  }
);



// Route to get all elections with detailed candidate information
router.get("/elections", async (req, res) => {
  try {
    const elections = await Election.find().populate({
      path: "candidates",
      populate: {
        path: "user",
        model: "User",
        select:
          "firstName lastName age sex role userProfileDetail userProfileImage votesCount", // Select required fields
      },
    });

    // Transform the data to make sure it includes the user details
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
          : null,
      })),
    }));

    res.json(formattedElections);
  } catch (error) {
    console.error("Error fetching elections:", error);
    res.status(500).json({ message: "Server error" });
  }
});




// Route to get an election by ID with candidates populated
router.get('/elections/:id', async (req, res) => {
  try {
    const election = await Election.findById(req.params.id).populate({
      path: 'candidates',
      populate: {
        path: 'user',
        model: 'User',
        select: 'firstName lastName role userProfileImage',
      },
    });
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }
    res.json(election);
  } catch (error) {
    console.error('Error fetching election:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

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

// Get an election by ID


module.exports = router;
