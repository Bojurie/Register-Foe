const express = require("express");
const router = express.Router();
const SavedElection = require("../model/savedElection");
const Election = require("../model/electionModel"); // Import the Election model
const authenticateJWT = require("../middleware/authMiddleware");
const User = require("../model/User");
const jwt = require("jsonwebtoken");

router.get("/user/:userId", authenticateJWT, async (req, res) => {
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

router.delete("/:id", authenticateJWT, async (req, res) => {
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
router.get("/saved-elections/:userId", authenticateJWT, async (req, res) => {
  const { userId } = req.params;

  try {
    const savedElections = await Election.find({ userId });

    res.status(200).json({ savedElections });
  } catch (error) {
    console.error("Error fetching saved elections:", error);
    res.status(500).json({ error: "Failed to fetch saved elections" });
  }
});

// Get Voted Past Elections by User

// Save Election
export const saveElection = async (electionData) => {
  try {
    const API_BASE_URL = "http://localhost:3000"; // Replace with your actual API base URL
    const response = await axios.post(
      `${API_BASE_URL}/auth/savedElection/save-election`, // Make sure the endpoint matches your server route
      { electionData },
      {
        headers: {
          Authorization: `Bearer ${getStoredToken()}`, // Assuming you're using JWT and have a function to get the stored token
        },
      }
    );

    if (response.status === 201) {
      console.log("Election saved successfully:", response.data);
      return { success: true, message: response.data.message };
    } else {
      throw new Error(response.data.error || "Failed to save election");
    }
  } catch (error) {
    console.error("Error saving election:", error);
    throw new Error(
      "An error occurred while saving the election. Please try again."
    );
  }
};

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