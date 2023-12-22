const express = require("express");
const router = express.Router();
const SavedElection = require("../model/savedElection");
const Election = require("../model/electionModel"); // Import the Election model
const authenticateJWT = require("../middleware/authMiddleware");

router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const savedElections = await SavedElection.find({ user: userId })
      .populate("election") 
      .exec();

    res.json({ savedElections });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const savedElectionId = req.params.id;

    await SavedElection.findByIdAndDelete(savedElectionId);

    res.json({ message: "Saved election deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Get Saved Elections by User
router.get('/saved-elections/:userId',  async (req, res) => {
  const { userId } = req.params;

  try {
    const savedElections = await Election.find({ userId });

    res.status(200).json({ savedElections });
  } catch (error) {
    console.error('Error fetching saved elections:', error);
    res.status(500).json({ error: 'Failed to fetch saved elections' });
  }
});

// Get Voted Past Elections by User

// Save Election
router.post("/save-election",authenticateJWT, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const userId = req.user._id;
    const { electionData } = req.body;

    const election = new Election({
      userId,
      ...electionData,
    });

    await election.save();
    res.status(201).json({ message: "Election saved successfully" });
  } catch (error) {
    console.error("Error saving election:", error);
    res.status(500).json({ error: "Failed to save election" });
  }
});


module.exports = router;

