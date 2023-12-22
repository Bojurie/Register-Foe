const express = require("express");
const Election = require("../model/electionModel") // Import the Election model
const router = express.Router();
const authenticateJWT = require("../middleware/authMiddleware");

 router.get("/upcoming-elections", async (req, res) => {
  try {
    const { state, city, zipCode } = req.query;
    if (!state || !city || !zipCode) {
      return res.status(400).json({
        error: "Missing required query parameters: state, city, or zipCode",
      });
    }
    const apiKey = process.env.FEC_API;
    const apiUrl = `https://api.open.fec.gov/v1/elections/?state=${state}&city=${city}&zip=${zipCode}&api_key=${apiKey}`;

    console.log(`Fetching elections data from: ${apiUrl}`);
    const response = await axios.get(apiUrl);
    const elections = response.data.results;

    res.json({ elections });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Create Election
router.post('/create-election', async (req, res) => {
  try {
    const { electionName, electionDate, constituency } = req.body;

    const newElection = new Election({
      electionName,
      electionDate,
      constituency,
    });

    await newElection.save();

    res.status(201).json({ message: 'Election created successfully' });
  } catch (error) {
    console.error('Error creating election:', error);
    res.status(500).json({ error: 'Failed to create election' });
  }
});

// Get Upcoming Elections
router.get('/demo/upcoming-elections', authenticateJWT, async (req, res) => {
  try {
    const upcomingElections = await Election.find({
      electionDate: { $gte: new Date() },
    })
      .sort({ electionDate: 1 })
      .populate({
        path: 'candidates.candidate',
        model: 'CandidateProfile',
      });

    res.status(200).json(upcomingElections);
  } catch (error) {
    console.error('Error fetching upcoming elections:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming elections' });
  }
});

// Vote in Election
router.post('/vote/:electionId/:candidateId', authenticateJWT, async (req, res) => {
  try {
    const { electionId, candidateId } = req.params;
    const userId = req.user._id;

    const hasVoted = await Election.exists({
      _id: electionId,
      'candidates.votes': { $elemMatch: { user: userId } },
    });

    if (hasVoted) {
      return res
        .status(400)
        .json({
          error: 'Already voted',
          message: 'You have already voted in this election',
        });
    }

    await Election.findOneAndUpdate(
      { _id: electionId, 'candidates.candidate': candidateId },
      {
        $inc: { 'candidates.$.votes': 1 },
        $push: { 'candidates.votes': { user: userId } },
      }
    );

    res.status(200).json({ message: 'Vote recorded successfully' });
  } catch (error) {
    console.error('Error recording vote:', error);
    res.status(500).json({ error: 'Failed to record vote' });
  }
});

// Get Saved Elections by User
router.get('/saved-elections/:userId', authenticateJWT, async (req, res) => {
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
router.get('/past-elections/voted/:userId', authenticateJWT, async (req, res) => {
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
    console.error('Error fetching voted past elections:', error);
    res.status(500).json({ error: 'Failed to fetch voted past elections' });
  }
});

// Save Election
router.post('/save-election', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user._id;
    const { electionData } = req.body;

    const election = new Election({
      userId,
      ...electionData,
    });

    await election.save();

    // Respond with a success message
    res.status(201).json({ message: 'Election saved successfully' });
  } catch (error) {
    console.error('Error saving election:', error);
    res.status(500).json({ error: 'Failed to save election' });
  }
});

module.exports = router;
