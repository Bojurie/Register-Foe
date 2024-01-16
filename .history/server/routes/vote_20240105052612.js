
const express = require("express");
const router = express.Router();
const User = require("../model/User"); // Import the User model
const Vote = require("../model/Vote");
const Election = require("../model/electionModel");



router.post(
  "/vote/:electionId/:candidateId",
  async (req, res) => {
    try {
      const { electionId, candidateId } = req.params;
      const userId = req.user._id;

      const election = await Election.findById(electionId);
      if (!election) {
        return res.status(404).json({ error: "Election not found" });
      }

      const hasVoted = await Vote.findOne({
        election: electionId,
        voter: userId,
      });
      if (hasVoted) {
        return res.status(400).json({ error: "Already voted" });
      }

      const newVote = new Vote({
        election: electionId,
        candidate: candidateId,
        voter: userId,
      });

      await newVote.save();

      res.status(200).json({ message: "Vote recorded successfully" });
    } catch (error) {
      console.error("Error recording vote:", error);
      res.status(500).json({ error: "Failed to record vote" });
    }
  }
);


router.get("/votes/election/:electionId", authenticateJWT, async (req, res) => {
  try {
    const { electionId } = req.params;
    const votes = await Vote.find({ election: electionId }).populate(
      "candidate",
      "firstName lastName"
    );
    res.status(200).json(votes);
  } catch (error) {
    console.error("Error fetching votes:", error);
    res.status(500).json({ error: "Failed to fetch votes" });
  }
});



router.get(
  "/votes/election/:electionId/candidate/:candidateId",
  authenticateJWT,
  async (req, res) => {
    try {
      const { electionId, candidateId } = req.params;
      const votes = await Vote.find({
        election: electionId,
        candidate: candidateId,
      });
      res.status(200).json(votes);
    } catch (error) {
      console.error("Error fetching votes for candidate:", error);
      res.status(500).json({ error: "Failed to fetch votes" });
    }
  }
);



router.get("/votes/voter/:voterId", authenticateJWT, async (req, res) => {
  try {
    const { voterId } = req.params;
    const votes = await Vote.find({ voter: voterId }).populate(
      "election",
      "title"
    );
    res.status(200).json(votes);
  } catch (error) {
    console.error("Error fetching votes by voter:", error);
    res.status(500).json({ error: "Failed to fetch votes" });
  }
});


