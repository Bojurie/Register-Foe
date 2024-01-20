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
    const { electionId } = req.body;
    console.log("Received electionId:", electionId); 

    const userRef = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(electionId)) {
      console.log("Invalid electionId detected"); 

      return res.status(400).json({ error: "Invalid election ID" });
    }
    const existingSave = await SavedElection.findOne({
      userRef,
      electionRef: electionId,
    });
    if (existingSave) {
      return res
        .status(409)
        .json({ error: "Election already saved by the user" });
    }
    const newSavedElection = new SavedElection({
      electionRef: electionId,
      userRef,
    });
    await newSavedElection.save();
    return res.status(201).json({ message: "Election saved successfully" });
  } catch (error) {
    console.error("Error saving election:", error);
    return res
      .status(500)
      .json({ error: "Failed to save election due to a server error" });
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