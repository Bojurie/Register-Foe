const express = require("express");
const Election = require("../model/electionModel") 
const router = express.Router();
const Vote = require("../model/Vote");
const User = require("../model/User"); 
const verifyToken = require("./verifyToken");


router.post("/create-election", verifyToken, async (req, res) => {
  console.log("Request Body:", req.body);

  if (!req.user.isCompany && !req.user.isAdmin) {
    return res
      .status(403)
      .json({ message: "You do not have permission to create an election." });
  }

  const { candidates, ...electionData } = req.body;

  if (!Array.isArray(candidates) || candidates.length === 0) {
    return res.status(400).json({ error: "Empty candidates array" });
  }

  try {
    const candidateDocs = await User.find({ _id: { $in: candidates } });
    if (candidateDocs.length !== candidates.length) {
      return res.status(400).json({ error: "Some candidate IDs are invalid" });
    }

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
    // Handle errors related to unique constraint violation
    if (error.code === 11000) {
      return res
        .status(400)
        .json({
          error: "This election ID already exists for the given company.",
        });
    }
    console.error("Error creating election:", error);
    res.status(500).json({ error: "Failed to create election" });
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
