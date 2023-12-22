const express = require("express");
const router = express.Router();
const SavedElection = require("../models/savedElection.model");

router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const savedElections = await SavedElection.find({ user: userId })
      .populate("election") 
      .exec();

    res.json({ savedElections });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const savedElectionId = req.params.id;

    await SavedElection.findByIdAndDelete(savedElectionId);

    res.json({ message: "Saved election deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

