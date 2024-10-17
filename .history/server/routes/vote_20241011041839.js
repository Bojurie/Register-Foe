const express = require("express");
const router = express.Router();
const Topic = require("../model/topic"); 
const Vote = require("../model/Vote");
const Election = require("../model/electionModel");
const verifyToken = require("./verifyToken");


// POSTING LIKES AND DISLIKES 
 router.post("/topics/:id/:action", verifyToken, async (req, res) => {
   const { id, action } = req.params;
   const userId = req.user._id;

   if (req.user.isCompany) {
     return res
       .status(403)
       .json({ message: "Only users can like or dislike topics." });
   }

   if (!["like", "dislike"].includes(action)) {
     return res
       .status(400)
       .json({ message: "Invalid action. Use 'like' or 'dislike'." });
   }

   try {
     const topic = await Topic.findById(id);
     if (!topic) {
       return res.status(404).json({ message: "Topic not found" });
     }

     // Initialize reactions if not already initialized
     if (!topic.reactions) {
       topic.reactions = {
         likes: [],
         dislikes: [],
         likeCount: 0,
         dislikeCount: 0,
       };
     }

     if (action === "like") {
       if (topic.reactions.likes.some((id) => id.equals(userId))) {
         return res
           .status(400)
           .json({ message: "You have already liked this topic." });
       }

       if (topic.reactions.dislikes.some((id) => id.equals(userId))) {
         topic.reactions.dislikes.pull(userId);
       }

       topic.reactions.likes.push(userId);
     }

     if (action === "dislike") {
       if (topic.reactions.dislikes.some((id) => id.equals(userId))) {
         return res
           .status(400)
           .json({ message: "You have already disliked this topic." });
       }

       if (topic.reactions.likes.some((id) => id.equals(userId))) {
         topic.reactions.likes.pull(userId);
       }

       topic.reactions.dislikes.push(userId);
     }

     await topic.save();

     return res.status(200).json({
       message: `Topic ${action}d successfully.`,
       likesCount: topic.reactions.likes.length,
       dislikesCount: topic.reactions.dislikes.length,
     });
   } catch (error) {
     console.error(`Error processing ${action}:`, error);
     return res
       .status(500)
       .json({ message: "Server error", error: error.message });
   }
 });






router.post(
  "/vote/:electionId/:candidateId",
  async (req, res) => {
    try {
      const { electionId, candidateId } = req.params;
      const userId = req.user._id;

      const election = await Election.findById(electionId);
      if (!election) {
        return res.status(404).json({ error: "Election not found" });
      }

      const hasVoted = await Vote.findOne({
        election: electionId,
        voter: userId,
      });
      if (hasVoted) {
        return res.status(400).json({ error: "Already voted" });
      }

      const newVote = new Vote({
        election: electionId,
        candidate: candidateId,
        voter: userId,
      });

      await newVote.save();

      res.status(200).json({ message: "Vote recorded successfully" });
    } catch (error) {
      console.error("Error recording vote:", error);
      res.status(500).json({ error: "Failed to record vote" });
    }
  }
);


router.get("/votes/election/:electionId", async (req, res) => {
  try {
    const { electionId } = req.params;
    const votes = await Vote.find({ election: electionId }).populate(
      "candidate",
      "firstName lastName"
    );
    res.status(200).json(votes);
  } catch (error) {
    console.error("Error fetching votes:", error);
    res.status(500).json({ error: "Failed to fetch votes" });
  }
});



router.get(
  "/votes/election/:electionId/candidate/:candidateId",

  async (req, res) => {
    try {
      const { electionId, candidateId } = req.params;
      const votes = await Vote.find({
        election: electionId,
        candidate: candidateId,
      });
      res.status(200).json(votes);
    } catch (error) {
      console.error("Error fetching votes for candidate:", error);
      res.status(500).json({ error: "Failed to fetch votes" });
    }
  }
);



router.get("/votes/voter/:voterId",  async (req, res) => {
  try {
    const { voterId } = req.params;
    const votes = await Vote.find({ voter: voterId }).populate(
      "election",
      "title"
    );
    res.status(200).json(votes);
  } catch (error) {
    console.error("Error fetching votes by voter:", error);
    res.status(500).json({ error: "Failed to fetch votes" });
  }
});


module.exports = router