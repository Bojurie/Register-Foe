const express = require("express");
const Election = require("../model/electionModel") 
const router = express.Router();
const User = require("../model/User"); 
const verifyToken = require("./verifyToken");


router.post("/create-election", async (req, res) => {
  try {
    const { candidates, ...electionData } = req.body;

    if (!Array.isArray(candidates)) {
      return res.status(400).json({ error: "Candidates must be an array" });
    }

    // Fetch all user documents for the provided candidate IDs
    const candidateDocs = await User.find({ _id: { $in: candidates } });

    // Check if any candidate ID in the request does not correspond to a fetched user
    const invalidCandidates = candidates.filter(
      (candidateId) =>
        !candidateDocs.some(
          (doc) => doc._id.toString() === candidateId.toString()
        )
    );

    if (invalidCandidates.length > 0) {
      return res
        .status(400)
        .json({
          error: `Invalid candidate IDs: ${invalidCandidates.join(", ")}`,
        });
    }

    // Proceed with creating the election
    const newElection = new Election({
      ...electionData,
      candidates: candidateDocs.map((doc) => doc._id),
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
    res.status(500).json({ error: "Failed to create election" });
  }
});




router.post("/vote/:electionId/:candidateId", verifyToken, async (req, res) => {
  try {
    const { electionId, candidateId } = req.params;
    const userId = req.user._id;

    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ error: "Election not found" });
    }

    const candidateExists = election.candidates.some(
      (candidate) => candidate._id.toString() === candidateId
    );
    if (!candidateExists) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    const hasVoted = election.candidates.some((candidate) =>
      candidate.votes.includes(userId)
    );
    if (hasVoted) {
      return res.status(400).json({
        error: "Already voted",
        message: "You have already voted in this election",
      });
    }

    await Election.updateOne(
      { _id: electionId, "candidates._id": candidateId },
      {
        $inc: { "candidates.$.voteCount": 1 },
        $push: { "candidates.$.votes": userId },
      }
    );

    res.status(200).json({ message: "Vote recorded successfully" });
  } catch (error) {
    console.error("Error recording vote:", error);
    res.status(500).json({ error: "Failed to record vote" });
  }
});



router.get("/upcoming-elections", async (req, res) => {
  try {
    const upcomingElections = await Election.find({
      electionEndDate: { $gte: new Date() },
    })
      .sort({ electionEndDate: 1 })
      .populate("candidates.user", "UserModelFields"); 

    res.json(upcomingElections);
  } catch (error) {
    console.error("Error fetching upcoming elections:", error);
    res.status(500).json({ error: "Failed to fetch upcoming elections" });
  }
});

router.get("/upcoming-elections/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const election = await Election.findById(id).populate(
      "candidates.user",
      "UserModelFields"
    );

    if (!election) {
      return res.status(404).json({ error: "Election not found" });
    }

    res.json(election);
  } catch (error) {
    console.error("Error fetching election:", error);
    res.status(500).json({ error: "Failed to retrieve election" });
  }
});



module.exports = router;
