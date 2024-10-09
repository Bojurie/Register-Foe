const express = require("express");
const router = express.Router();
const Election = require("../model/electionModel");
const User = require("../model/User");
const verifyToken = require("./verifyToken");
const createUniqueElection = require("../utils/helper");

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
    const candidateDocs = await User.find({ _id: { $in: candidates } });
    if (candidateDocs.length !== candidates.length) {
      return res.status(400).json({ error: "Some candidate IDs are invalid" });
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


router.get("/candidates/:electionId", verifyToken, async (req, res) => {
  try {
    const { electionId } = req.params;

    // Find the election by ID and populate candidate details
    const election = await Election.findById(electionId).populate(
      "candidates.user"
    );

    if (!election) {
      return res.status(404).json({ error: "Election not found" });
    }

    // Extract the candidate details from the election
    const candidates = election.candidates.map((candidate) => candidate.user);

    res.status(200).json(candidates);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ error: "Failed to fetch candidates." });
  }
});

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



router.get("/election/:electionId", verifyToken, async (req, res) => {
  const { electionId } = req.params;

  try {
    // Find the election by ID using electionId as a string
    const election = await Election.findOne({ electionId }).populate(
      "candidates"
    );

    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    const candidatesArray = election.candidates || []; // Ensure candidates is an array
    const totalVotes = candidatesArray.reduce(
      (acc, candidate) => acc + (candidate.votes || 0),
      0
    );

    // Calculate vote percentages for each candidate
    const candidatesWithPercentages = candidatesArray.map((candidate) => {
      const percentage =
        totalVotes > 0
          ? ((candidate.votes / totalVotes) * 100).toFixed(2)
          : "0.00";
      return {
        ...candidate.toObject(),
        votePercentage: percentage,
      };
    });

    const electionWithCandidates = {
      ...election.toObject(),
      candidates: candidatesWithPercentages,
    };

    res.status(200).json({ election: electionWithCandidates });
  } catch (error) {
    console.error("Error fetching election by ID:", error);
    res
      .status(500)
      .json({ message: "Error fetching election", error: error.message });
  }
});


module.exports = router;
