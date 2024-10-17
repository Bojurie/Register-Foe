const express = require("express");
const router = express.Router();
const PastElection = require("../model/pastElection");
const Election = require("../model/electionModel"); 
const verifyToken = require("./verifyToken");


router.get("/user/:userId", verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;

    const pastElections = await PastElection.find({ user: userId })
      .populate("election")
      .exec();

    res.json({ pastElections });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET ALL PAST ELECTION THAT USER HAS VOTED ON
router.get("/voted/:userId", verifyToken, async (req, res) => {
   const userId = req.user._id;
  try {
    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    // Fetch past elections where the user has voted and election date is in the past
    const votedPastElections = await Election.find({
      userId,
      hasVoted: true,
      electionDate: { $lt: new Date() }, // Ensure election date is in the past
    });

    if (!votedPastElections.length) {
      return res.status(404).json({ message: "No past elections found." });
    }

    res.status(200).json({ votedPastElections });
  } catch (error) {
    console.error("Error fetching voted past elections:", error);
    res.status(500).json({ error: "Failed to fetch voted past elections." });
  }
});

module.exports = router;
