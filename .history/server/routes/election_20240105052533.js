const express = require("express");
const Election = require("../model/electionModel") 
const router = express.Router();
const Vote = require("../model/Vote");
const User = require("../model/User"); 
const verifyToken = require("./verifyToken");
const {
  authenticateJWT,
  isCompanyOrAdmin,
} = require("../middleware/authMiddleware");

router.post("/create-election", authenticateJWT, async (req, res) => {
  try {
    const { candidates, ...electionData } = req.body;
    if (!Array.isArray(candidates)) {
      return res.status(400).json({ error: "Candidates must be an array" });
    }
    const candidateDocs = await User.find({ _id: { $in: candidates } });
    const invalidCandidates = candidates.filter(
      (candidateId) =>
        !candidateDocs.some(
          (doc) => doc._id.toString() === candidateId.toString()
        )
    );

    if (invalidCandidates.length > 0) {
      return res.status(400).json({
        error: `Invalid candidate IDs: ${invalidCandidates.join(", ")}`,
      });
    }

    electionData.createdBy = req.user.id;
    const newElection = new Election({
      ...electionData,
      candidates: candidateDocs.map((doc) => doc._id), 
    });

    await newElection.save();

    res.status(201).json({
      message: "Election created successfully",
      election: newElection,
    });
  } catch (error) {
    console.error("Error creating election:", error);
    res.status(500).json({ error: "Failed to create election" });
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
