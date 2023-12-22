const express = require("express");
const router = express.Router();
const PastElection = require("../model/pastElection");

router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const pastElections = await PastElection.find({ user: userId })
      .populate("election") 
      .exec();

    res.json({ pastElections });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
