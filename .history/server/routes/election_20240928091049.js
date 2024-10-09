const express = require("express");
const router = express.Router();
const Election = require("../model/electionModel");
const User = require("../model/User");
const verifyToken = require("./verifyToken");
const createUniqueElection = require("../utils/helper");

const isAuthorized = (user) => user.role === "Admin" || user.isCompany;

const validateCandidates = async (candidates) => {
  if (!Array.isArray(candidates) || candidates.length === 0) {
    throw new Error("Candidates array cannot be empty");
  }
  const candidateDocs = await User.find({ _id: { $in: candidates } });
  if (candidateDocs.length !== candidates.length) {
    throw new Error("Some candidate IDs are invalid");
  }
  return candidateDocs.map((candidate) => ({
    user: candidate._id,
    votes: 0,
  }));
};

// Route to create an election
router.post("/create-election", verifyToken, async (req, res) => {
  try {
    if (!isAuthorized(req.user)) {
      return res.status(403).json({
        message: "You do not have permission to create an election.",
      });
    }

    const { candidates, ...electionData } = req.body;

    console.log("Received election data:", electionData);
    console.log("Received candidates:", candidates);

    const candidateDocs = await validateCandidates(candidates);

    const newElection = await createUniqueElection(
      { ...electionData, candidates: candidateDocs },
      candidateDocs
    );
    res.status(201).json({
      message: "Election created successfully",
      election: newElection,
    });
  } catch (error) {
    console.error("Error processing create election request:", error);
    res.status(400).json({ error: error.message });
  }
});

router.get(
  "/check-unique/:companyCode/:electionId",
  verifyToken,
  async (req, res) => {
    try {
      const { companyCode, electionId } = req.params;
      const existingElection = await Election.findOne({
        companyCode,
        electionId,
      });

      res.status(200).json({ exists: !!existingElection });
    } catch (error) {
      console.error("Error in check-unique route:", error);
      res.status(500).json({ error: "Failed to check election uniqueness" });
    }
  }
);

// Route to vote in an election
router.post("/election-vote", verifyToken, async (req, res) => {
  try {
    const { electionId, candidateId } = req.body;
    const voterId = req.user._id;

    const voter = await User.findById(voterId);
    if (!voter) {
      return res.status(404).json({ error: "Voter not found" });
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

router.get(
  "/upcoming-elections/byCompanyCode/:companyCode",
  verifyToken,
  async (req, res) => {
    try {
      const { companyCode } = req.params;
      const userCompanyCode = req.user.companyCode;

      if (!companyCode) {
        return res.status(400).json({ message: "Company code is required" });
      }

      if (companyCode !== userCompanyCode) {
        return res
          .status(403)
          .json({ message: "Access denied. Company codes do not match." });
      }

      const currentDate = new Date();
      const elections = await Election.find({
        companyCode,
        endDate: { $gte: currentDate },
      }).populate("candidates.user");

      const electionsWithVotePercentages = elections.map((election) => {
        const totalVotes = election.candidates.reduce(
          (acc, candidate) => acc + candidate.votes,
          0
        );

        const candidatesWithPercentages = election.candidates.map(
          (candidate) => {
            const percentage =
              totalVotes > 0
                ? ((candidate.votes / totalVotes) * 100).toFixed(2)
                : "0.00";
            return {
              ...candidate.toObject(),
              votePercentage: percentage,
            };
          }
        );

        return {
          ...election.toObject(),
          candidates: candidatesWithPercentages,
        };
      });

      res.status(200).json(electionsWithVotePercentages);
    } catch (error) {
      console.error("Error fetching elections:", error);
      res.status(500).json({
        message: "Error fetching elections",
        error: error.message,
      });
    }
  }
);

module.exports = router;
