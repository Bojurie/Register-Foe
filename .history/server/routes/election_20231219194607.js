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

module.exports = router;
