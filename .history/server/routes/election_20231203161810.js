const express = require("express");
const router = express.Router();
const axios = require("axios");


router.get("/api/elections", async (req, res) => {
  try {
    const { state, city, zipCode } = req.query;

    // Construct FEC API URL based on search parameters
    const apiUrl = `https://api.open.fec.gov/v1/elections/?state=${state}&city=${city}&zip_code=${zipCode}&api_key=YOUR_FEC_API_KEY`;

    const response = await axios.get(apiUrl);
    const elections = response.data.results;

    res.json(elections);
  } catch (error) {
    console.error("Error fetching elections:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
