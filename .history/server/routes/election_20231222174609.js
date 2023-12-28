const express = require("express");
const Election = require("../model/electionModel") 
const router = express.Router();
const {authenticateJWT, isCompany} = require("../middleware/authMiddleware");


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

      // Ensure the authenticated user is a company
      if (!req.user || !req.user.isCompany) {
        return res
          .status(403)
          .json({ error: "Unauthorized: Only companies can create elections" });
      }

      // Create a new election instance
      const newElection = new Election({
        electionName,
        electionType,
        electionStartDate,
        electionEndDate,
        createdBy: req.user._id, // Link the election to the company
        electionDesc,
        candidates,
      });

      // Save the new election
      await newElection.save();

      res.status(201).json({
        message: "Election created successfully",
        election: newElection,
      });
    } catch (error) {
      console.error("Error creating election:", error);
      res.status(500).json({ error: "Failed to create election" });
    }
  }
);

// Get Upcoming Elections Route
router.get("/upcoming-elections", async (req, res) => {
  try {
    const upcomingElections = await Election.find({
      electionEndDate: { $gte: new Date() }, // Filter based on electionEndDate
    })
      .sort({ electionEndDate: 1 })
      .populate("candidates.candidate", "CandidateProfile"); // Adjust the second parameter as needed

    res.status(200).json(upcomingElections);
  } catch (error) {
    console.error("Error fetching upcoming elections:", error);
    res.status(500).json({ error: "Failed to fetch upcoming elections" });
  }
});

// Get Specific Election Route
router.get("/upcoming-elections/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const election = await Election.findById(id).populate(
      "candidates.candidate",
      "CandidateProfile"
    ); // Adjust the second parameter as needed

    if (!election) {
      return res.status(404).json({ error: "Election not found" });
    }

    res.json(election);
  } catch (error) {
    console.error("Error fetching election:", error);
    res.status(500).json({ error: "Failed to retrieve election" });
  }
});

// Vote in Election
router.post(
  "/vote/:electionId/:candidateId",
  authenticateJWT,
  async (req, res) => {
    try {
      const { electionId, candidateId } = req.params;
      const userId = req.user._id;

      const hasVoted = await Election.exists({
        _id: electionId,
        "candidates.votes": { $elemMatch: { user: userId } },
      });

      if (hasVoted) {
        return res.status(400).json({
          error: "Already voted",
          message: "You have already voted in this election",
        });
      }

      await Election.findOneAndUpdate(
        { _id: electionId, "candidates.candidate": candidateId },
        {
          $inc: { "candidates.$.votes": 1 },
          $push: { "candidates.votes": { user: userId } },
        }
      );

      res.status(200).json({ message: "Vote recorded successfully" });
    } catch (error) {
      console.error("Error recording vote:", error);
      res.status(500).json({ error: "Failed to record vote" });
    }
  }
);


module.exports = router;
