const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Election = require("../model/electionModel");
const User = require("../model/User");
const verifyToken = require("./verifyToken");
const createUniqueElection = require("../utils/helper");
const Candidate = require("../model/candidate");

// Helper function to validate MongoDB ObjectIds
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Create a new election
router.post("/create-election", verifyToken, async (req, res) => {
  if (!req.user.isCompany && !req.user.isAdmin) {
    return res
      .status(403)
      .json({ message: "You do not have permission to create an election." });
  }

  const { candidates, ...electionData } = req.body;

  try {
    // Validate candidates array
    if (!Array.isArray(candidates) || candidates.length === 0) {
      return res
        .status(400)
        .json({ error: "Candidates array cannot be empty" });
    }

    // Validate candidate IDs
    const validCandidateIds = candidates.filter(isValidObjectId);
    if (validCandidateIds.length !== candidates.length) {
      return res.status(400).json({ error: "Some candidate IDs are invalid" });
    }

    const candidateDocs = await User.find({ _id: { $in: validCandidateIds } });
    if (candidateDocs.length !== validCandidateIds.length) {
      return res
        .status(400)
        .json({ error: "Some candidate IDs are not found" });
    }

    // Create the election
    const newElection = await createUniqueElection(electionData, candidateDocs);

    // Respond with success
    res.status(201).json({
      message: "Election created successfully",
      election: newElection,
    });
  } catch (error) {
    console.error("Error processing create election request:", error);
    res.status(500).json({ error: "Failed to create election." });
  }
});

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

// Get candidates of an election
router.get(
  "/election/candidates/:electionId",
  verifyToken,
  async (req, res) => {
    try {
      const { electionId } = req.params;

      if (!isValidObjectId(electionId)) {
        return res.status(400).json({ error: "Invalid Election ID format" });
      }

      const election = await Election.findById(electionId).populate(
        "candidates.user"
      );

      if (!election) {
        return res.status(404).json({ error: "Election not found" });
      }

      const candidates = election.candidates.map((candidate) => candidate.user);
      res.status(200).json(candidates);
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
