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


router.get("/past-elections/voted/:userId", verifyToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const votedPastElections = await Election.find({
      userId, 
      hasVoted: true, 
      electionDate: { $lt: new Date() }, 
    });

    res.status(200).json({ votedPastElections });
  } catch (error) {
    console.error("Error fetching voted past elections:", error);
    res.status(500).json({ error: "Failed to fetch voted past elections" });
  }
});

module.exports = router;
