const express = require("express");
const router = express.Router();
const PastElection = require("../model/pastElection");
const Election = require("../model/electionModel"); // Import the Election model
const authenticateJWT = require("../middleware/authMiddleware");

router.get("/user/:userId", async (req, res) => {
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


router.get(
  "/past-elections/voted/:userId",
  async (req, res) => {
    const { userId } = req.params;

    try {
      // Query the database to retrieve past elections that the user has voted in
      const votedPastElections = await Election.find({
        userId, // Filter by the user's ID
        hasVoted: true, // Assuming you have a field to track whether a user has voted in an election
        electionDate: { $lt: new Date() }, // Filter for past elections
      });

      // Send the retrieved data as a JSON response
      res.status(200).json({ votedPastElections });
    } catch (error) {
      console.error("Error fetching voted past elections:", error);
      res.status(500).json({ error: "Failed to fetch voted past elections" });
    }
  }
);

module.exports = router;
