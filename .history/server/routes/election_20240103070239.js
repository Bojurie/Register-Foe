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

    const candidateDocs = await User.find({ _id: { $in: candidates } });

    const invalidCandidates = candidates.filter(
      (candidateId) =>
        !candidateDocs.some(
          (doc) => doc._id.toString() === candidateId.toString()
        )
    );

    if (invalidCandidates.length > 0) {
      return res.status(400).json({
        error: `Invalid candidate IDs: ${invalidCandidates.join(", ")}`,
      });
    }

    // Add createdBy and onModel based on the authenticated user
    electionData.createdBy = req.user.id; // Assuming req.user.id is the authenticated user's ID
    electionData.onModel = req.user.isCompany ? "Company" : "User";

    // Map candidateDocs to an array of candidate objects
    const candidateObjects = candidateDocs.map((doc) => ({
      user: doc._id,
      votes: 0, // You can set the default votes here if needed
    }));

    const newElection = new Election({
      ...electionData,
      candidates: candidateObjects,
    });
    await newElection.save();

    res.status(201).json({
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
