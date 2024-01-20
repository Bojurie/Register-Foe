const express = require("express");
const router = express.Router();
const SavedElection = require("../model/savedElection");
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const verifyToken = require("./verifyToken");
const mongoose = require("mongoose");


router.get("/user/:userId", verifyToken, async (req, res) => {
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

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const savedElectionId = req.params.id;

    await SavedElection.findByIdAndDelete(savedElectionId);

    res.json({ message: "Saved election deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Get Saved Elections by User
router.get("/saved-elections/:userId", verifyToken, async (req, res) => {
  const { userId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("Invalid user ID:", userId);
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const savedElections = await SavedElection.find({ userRef: userId })
      .populate("electionRef")
      .exec();

    console.log("Fetched saved elections:", savedElections);

    res.status(200).json({ savedElections });
  } catch (error) {
    console.error("Error fetching saved elections:", error);
    res.status(500).json({ error: "Failed to fetch saved elections" });
  }
});





// Save Election

router.post("/save-elections", verifyToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { electionIds } = req.body;
    console.log("Received electionIds:", electionIds);

    const userRef = req.user._id;

    if (!Array.isArray(electionIds) || electionIds.length === 0) {
      console.log("Invalid electionIds detected");
      return res.status(400).json({ error: "Invalid election IDs" });
    }
    if (electionIds.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
      console.log("Invalid election ID detected");
      return res.status(400).json({ error: "Invalid election ID" });
    }
    const existingSaves = await SavedElection.find({
      userRef,
      electionRef: { $in: electionIds },
    });

    const existingElectionIds = existingSaves.map((save) => save.electionRef);
    const duplicateIds = electionIds.filter((id) =>
      existingElectionIds.includes(id)
    );

    if (duplicateIds.length > 0) {
      console.log("Some elections already saved by the user");
      return res.status(409).json({
        error: "Some elections already saved by the user",
        duplicates: duplicateIds,
      });
    }

    const newSavedElections = electionIds.map((electionId) => ({
      electionRef: electionId,
      userRef,
    }));

    await SavedElection.insertMany(newSavedElections);
    console.log("Elections saved successfully");

    return res.status(201).json({ message: "Elections saved successfully" });
  } catch (error) {
    console.error("Error saving elections:", error);
    return res
      .status(500)
      .json({ error: "Failed to save elections due to a server error" });
  }
});





// router.post("/token", async (req, res) => {
//   const { refreshToken } = req.body;

//   if (!refreshToken) {
//     return res.status(401).json({ error: "Refresh token required" });
//   }

//   try {
//     const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
//     const user = await User.findById(decoded.sub);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const accessToken = jwt.sign(
//       { sub: user._id, username: user.username },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.json({ accessToken });
//   } catch (error) {
//     return res.status(403).json({ error: "Invalid refresh token" });
//   }
// });

module.exports = router;