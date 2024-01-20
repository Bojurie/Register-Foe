const express = require("express");
const Election = require("../model/electionModel") 
const router = express.Router();
const Vote = require("../model/Vote");
const User = require("../model/User"); 
const verifyToken = require("./verifyToken");
const { v4: uuidRandom } = require("uuid");

router.post("/create-election", verifyToken, async (req, res) => {

  if (!req.user.isCompany && !req.user.isAdmin) {
    return res
      .status(403)
      .json({ message: "You do not have permission to create an election." });
  }

  const { candidates, ...electionData } = req.body;

  try {
    if (!Array.isArray(candidates) || candidates.length === 0) {
      return res.status(400).json({ error: "Empty candidates array" });
    }

    const candidateDocs = await User.find({ _id: { $in: candidates } });
    if (candidateDocs.length !== candidates.length) {
      return res.status(400).json({ error: "Some candidate IDs are invalid" });
    }

    let attemptCount = 0;
    const maxAttempts = 5; 

    while (true) {
      try {
        electionData.electionId = electionData.electionId || uuidRandom();
        const newElection = new Election({
          ...electionData,
          candidates: candidateDocs.map((doc) => doc._id),
        });

        await newElection.save();
        res.status(201).json({
          message: "Election created successfully",
          election: newElection,
        });
        break; 
      } catch (error) {
  if (error.code === 11000) {
    if (attemptCount < maxAttempts) {
      electionData.electionId = uuidRandom();
      attemptCount++;
    } else {
      console.error("Error creating election due to duplicate key:", error);
      res.status(400).json({ error: "Election ID already exists. Max attempts reached." });
      break;
    }
  } else {
    console.error("Error creating election:", error);
    res.status(500).json({ error: "Failed to create election" });
    break;
  }
}
    }
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
});



router.get(
  "/check-unique/:companyCode/:electionId",
  verifyToken,
  async (req, res) => {
    try {
      const { companyCode, electionId } = req.params;

      const existingElection = await Election.findOne({
        companyCode,
        electionId,
      });

      if (existingElection) {
        res.json({ exists: true });
      } else {
        res.json({ exists: false });
      }
    } catch (error) {
      console.error("Error in check-unique route:", error);
      res.status(500).json({ error: "Failed to check election uniqueness" });
    }
  }
);

router.post("/election-vote", verifyToken, async (req, res) => {
  try {
    const { electionId, userId } = req.body;

    // Check if the user is eligible to vote (not a candidate in the election)
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ error: "Election not found" });
    }

    if (election.candidates.includes(user._id)) {
      return res
        .status(403)
        .json({ error: "You cannot vote in an election you are running in" });
    }

    // Check if the user has already voted in this election
    if (election.votes.some((vote) => vote.voter.equals(user._id))) {
      return res
        .status(403)
        .json({ error: "You have already voted in this election" });
    }

    // Check if the candidate is valid
    const candidate = await User.findById(userId);
    if (!candidate || !election.candidates.includes(candidate._id)) {
      return res.status(400).json({ error: "Invalid candidate ID" });
    }

    // Record the vote
    election.votes.push({
      voter: user._id,
      candidate: candidate._id,
    });

    const candidateIndex = election.candidates.findIndex((c) =>
      c.equals(candidate._id)
    );
    if (candidateIndex !== -1) {
      candidate.votes += 1; 
      await candidate.save();
    }

    await election.save();

    res.status(200).json({ message: "Vote recorded successfully" });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
});


router.get("/upcoming-elections/byCompanyCode/:companyCode", async (req, res) => {
 const { companyCode } = req.params;
 if (!companyCode) {
   return res.status(400).json({ message: "Company code is required" });
 }
try {
  const elections = await Election.find({ companyCode });
  res.status(200).json(elections);
} catch (error) {
  res
    .status(500)
    .json({ message: "Error fetching topics", error: error.message });
}
});


router.get(
  "/election/upcoming-elections/:electionId/company/:companyCode",
  async (req, res) => {
    try {
      const { electionId, companyCode } = req.params;

      if (!companyCode || !electionId) {
        return res
          .status(400)
          .json({ message: "Company code and electionId are required" });
      }
console.log(
  `Received params - electionId: ${electionId}, companyCode: ${companyCode}`
);

      const electionData = await getElectionsByTheirId(companyCode, electionId);
      res.json(electionData);
    } catch (error) {
      console.error("Error fetching election data:", error);
      res.status(500).json({ error: "Error fetching election data" });
    }
  }
);



module.exports = router;
