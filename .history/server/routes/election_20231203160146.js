const express = require("express");
const router = express.Router();

router.get("/api/elections", async (req, res) => {
  try {
    const { state, date, type, zipCode } = req.query;

    // Replace 'YOUR_FEC_API_KEY' with your actual API key
    const apiKey = "YOUR_FEC_API_KEY";
    const baseUrl = "https://api.open.fec.gov/v1";

    const electionsEndpoint = "/elections/";
    const electionsParams = {
      api_key: apiKey,
      state,
      date,
      type,
    };

    if (zipCode) {
      electionsParams.zip = zipCode;
    }

    const electionsResponse = await axios.get(
      `${baseUrl}${electionsEndpoint}`,
      { params: electionsParams }
    );

    res.json(electionsResponse.data.results);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
