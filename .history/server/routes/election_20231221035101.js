const express = require("express");

const router = express.Router();

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



// DEMO ELECTION

router.post("/create-election", async (req, res) => {
  try {
    const { electionName, electionDate, constituency } = req.body;

    const newElection = new Election({
      electionName,
      electionDate,
      constituency,
    });

    await newElection.save();

    res.status(201).json({ message: "Election created successfully" });
  } catch (error) {
    console.error("Error creating election:", error);
    res.status(500).json({ error: "Failed to create election" });
  }
});


router.get("/demo/upcoming-elections", async (req, res) => {
  try {
    const upcomingElections = await Election.find({
      electionDate: { $gte: new Date() }, // Find elections with dates greater than or equal to the current date
    }).sort({ electionDate: 1 }); // Sort by electionDate in ascending order

    res.status(200).json(upcomingElections);
  } catch (error) {
    console.error("Error fetching upcoming elections:", error);
    res.status(500).json({ error: "Failed to fetch upcoming elections" });
  }
});
module.exports = router;
