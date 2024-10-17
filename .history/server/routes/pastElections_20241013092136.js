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
  // Extract the logged-in user's ID from the request
  const userId = req.user._id;

  try {
    // Check if userId exists
    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    // Fetch elections where the user has voted and the election date is in the past
    const votedPastElections = await Election.find({
      userId,
      hasVoted: true,
      electionDate: { $lt: new Date() }, // Ensure election date is in the past
    });

    // If no elections found, return a 404 response
    if (!votedPastElections.length) {
      return res.status(404).json({ message: "No past elections found." });
    }

    // Return the found elections
    res.status(200).json({ votedPastElections });
  } catch (error) {
    console.error("Error fetching voted past elections:", error.message);
    res.status(500).json({ error: "Failed to fetch voted past elections." });
  }
});


module.exports = router;
