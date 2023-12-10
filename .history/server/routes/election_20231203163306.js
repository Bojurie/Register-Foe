const express = require("express");
const router = express.Router();
const axios = require("axios");


router.get("/api/elections", async (req, res) => {
  try {
    const { state, city, zipCode } = req.query;
    const apiKey = process.env.FEC_API;

    // Construct the API URL based on the user's search parameters
    const apiUrl = `https://api.open.fec.gov/v1/elections/?state=${state}&city=${city}&zip=${zipCode}&api_key=${apiKey}`;

    const response = await axios.get(apiUrl);
    const elections = response.data.results;

    res.json({ elections });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
