const express = require("express");
const Election = require("../model/electionModel") 
const router = express.Router();
const User = require("../model/User"); 
const { authenticateJWT, isCompany } = require("../middleware/authMiddleware");


router.post(
  "/create-election",
  authenticateJWT,
  isCompany,
  async (req, res) => {
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

      if (!Array.isArray(candidates)) {
        return res.status(400).json({ error: "Candidates must be an array" });
      }

      for (const candidateId of candidates) {
        const candidate = await User.findById(candidateId);
        if (!candidate || candidate.companyCode !== req.user.companyCode) {
          return res
            .status(400)
            .json({ error: `Invalid candidate with ID: ${candidateId}` });
        }
      }

      const newElection = new Election({
        electionName,
        electionType,
        electionStartDate,
        electionEndDate,
        createdBy: req.user._id, 
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
      res.status(500).json({ error: "Failed to create election" });
    }
  }
);



// Vote in Electio

router.post(
  "/vote/:electionId/:candidateId",
  authenticateJWT,
  async (req, res) => {
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
        return res
          .status(400)
          .json({
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
  }
);



router.get("/upcoming-elections", async (req, res) => {
  try {
    const upcomingElections = await Election.find({
      electionEndDate: { $gte: new Date() },
    })
      .sort({ electionEndDate: 1 })
      .populate("candidates.user", "UserModelFields"); 

    res.status(200).json(upcomingElections);
  } catch (error) {
    console.error("Error fetching upcoming elections:", error);
    res.status(500).json({ error: "Failed to fetch upcoming elections" });
  }
});

router.get("/upcoming-elections/:id", async (req, res) => {
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
