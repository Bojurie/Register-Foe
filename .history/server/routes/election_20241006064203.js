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

    const validCandidateIds = candidates.filter(isValidObjectId);
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
          election: newElection._id, // Use the `_id` of the saved election
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





// POST ELECTION VOTES FOR CANDIDATE 

router.post("/elections/:electionId/vote", async (req, res) => {
  try {
    const { electionId } = req.params;
    const { candidateId } = req.body;

    // Find the election by its ID
    const election = await Election.findById(electionId);

    if (!election) {
      return res.status(404).json({ error: "Election not found" });
    }

    // Cast the vote
    await election.castVote(candidateId);
    res.status(200).json({ message: "Vote cast successfully" });
  } catch (error) {
    console.error("Error casting vote:", error.message);
    res.status(500).json({ error: error.message });
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


// Check election uniqueness
router.get(
  "/check-unique/:companyCode/:electionId",
  verifyToken,
  async (req, res) => {
    try {
      const { companyCode, electionId } = req.params;

      if (!isValidObjectId(electionId)) {
        return res.status(400).json({ error: "Invalid Election ID format" });
      }

      const existingElection = await Election.findOne({
        companyCode,
        _id: electionId,
      });
      res.status(200).json({ exists: !!existingElection });
    } catch (error) {
      console.error("Error in check-unique route:", error);
      res.status(500).json({ error: "Failed to check election uniqueness" });
    }
  }
);

router.get(
  "/elections/candidates/:electionId",
  verifyToken,
  async (req, res) => {
    try {
      const { electionId } = req.params;

      console.log("Fetching election with ID:", electionId);

      // Validate election ID format
      if (!isValidObjectId(electionId)) {
        console.log("Invalid Election ID format:", electionId);
        return res.status(400).json({ error: "Invalid Election ID format" });
      }

      // Find the election and populate candidates and their user data
      const election = await Election.findById(electionId).populate({
        path: "candidates",
        populate: {
          path: "user",
          model: "User",
          select: "firstName lastName age userProfileImage votesCount",
        },
      });

      if (!election) {
        console.log("Election not found for ID:", electionId);
        return res.status(404).json({ error: "Election not found" });
      }

      console.log(
        "Election found, candidates length:",
        election.candidates?.length
      );

      // Ensure that candidates exist
      if (!election.candidates || election.candidates.length === 0) {
        console.log("No candidates found for election ID:", electionId);
        return res
          .status(404)
          .json({ error: "No candidates found for this election." });
      }

      // Extract candidate user information
      const candidates = election.candidates
        .map((candidate) => {
          if (candidate && candidate.user) {
            return {
              id: candidate.user._id,
              firstName: candidate.user.firstName,
              lastName: candidate.user.lastName,
              age: candidate.user.age,
              userProfileImage: candidate.user.userProfileImage,
              votesCount: candidate.user.votesCount,
            };
          } else {
            console.log(
              "Invalid candidate data found for election:",
              candidate
            );
            return null;
          }
        })
        .filter((candidate) => candidate !== null); // Filter out any null candidates

      console.log("Candidates for election ID", electionId, ":", candidates);

      // Return the list of candidates
      res.status(200).json({ candidates });
    } catch (error) {
      console.error("Error fetching candidates:", error);
      res.status(500).json({ error: "Failed to fetch candidates." });
    }
  }
);




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
router.get("/elections/:companyCode", verifyToken, async (req, res) => {
  const { companyCode } = req.params;

  if (!companyCode) {
    return res.status(400).json({ error: "Company code is required." });
  }

  try {
    const elections = await Election.find({ companyCode })
      .populate({
        path: "candidates",
        populate: {
          path: "user",
          model: "User",
          select: "firstName lastName",
        },
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
        (acc, candidate) => acc + (candidate.votes?.totalVotes || 0),
        0
      );

      const candidatesWithPercentages = election.candidates.map((candidate) => {
        const votePercentage =
          totalVotes > 0
            ? ((candidate.votes?.totalVotes / totalVotes) * 100).toFixed(2)
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

module.exports = router;
