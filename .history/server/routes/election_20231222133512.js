const express = require("express");
const Election = require("../model/electionModel") // Import the Election model
const router = express.Router();
const authenticateJWT = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/authMiddleware");

//  router.get("/upcoming-elections", async (req, res) => {
//   try {
//     const { state, city, zipCode } = req.query;
//     if (!state || !city || !zipCode) {
//       return res.status(400).json({
//         error: "Missing required query parameters: state, city, or zipCode",
//       });
//     }
//     const apiKey = process.env.FEC_API;
//     const apiUrl = `https://api.open.fec.gov/v1/elections/?state=${state}&city=${city}&zip=${zipCode}&api_key=${apiKey}`;

//     console.log(`Fetching elections data from: ${apiUrl}`);
//     const response = await axios.get(apiUrl);
//     const elections = response.data.results;

//     res.json({ elections });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });


// Create Election
router.post("/create-election", isAdmin, async (req, res) => {
  try {
    const {
      electionName,
      electionType,
      electionStartDate,
      electionEndDate,
      CompanyName,
      electionDesc,
      candidates, // Assuming candidates are provided in the request
    } = req.body;

    // Create a new election instance
    const newElection = new Election({
      electionName,
      electionType,
      electionStartDate,
      electionEndDate,
      CompanyName,
      electionDesc,
      candidates,
    });

    // Save the new election
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

// Get Upcoming Elections
router.get("/upcoming-elections", async (req, res) => {
  try {
    const upcomingElections = await Election.find({
      electionDate: { $gte: new Date() },
    })
      .sort({ electionDate: 1 })
      .populate({
        path: "candidates.candidate",
        model: "CandidateProfile",
      });

    res.status(200).json(upcomingElections);
  } catch (error) {
    console.error("Error fetching upcoming elections:", error);
    res.status(500).json({ error: "Failed to fetch upcoming elections" });
  }
});


router.get("/upcoming-elections/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const election = await Election.findById(id);

    if (!election) {
      return res.status(404).send("Election not found");
    }

    res.json(election);
  } catch (error) {
    console.error("Error fetching election:", error);
    res.status(500).send("Server error");
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
