const express = require("express");
const router = express.Router();
const Topic = require("../model/topic"); 
const Vote = require("../model/Vote");
const Election = require("../model/electionModel");
const verifyToken = require("./verifyToken");


// Like route
router.post("/topics/:id/like", verifyToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  if (req.user.isCompany) {
    return res
      .status(403)
      .json({ message: "Only users can like or dislike topics." });
  }

  try {
    const topic = await Topic.findById(id);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    // Prevent liking if already liked
    if (topic.likes.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You have already liked this topic." });
    }

    // Remove from dislikes if it exists
    if (topic.dislikes.includes(userId)) {
      topic.dislikes.pull(userId);
    }

    topic.likes.push(userId); 
    await topic.save();

    res.status(200).json({
      message: "Topic liked successfully.",
      likesCount: topic.likes.length,
      dislikesCount: topic.dislikes.length,
    });
  } catch (error) {
    console.error("Error liking the topic:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});




// Dislike route
router.post("/topics/:id/dislike", async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  if (req.user.isCompany) {
    return res
      .status(403)
      .json({ message: "Only users can like or dislike topics." });
  }

  try {
    const topic = await Topic.findById(id);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    if (topic.dislikes.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You have already disliked this topic." });
    }

    if (topic.likes.includes(userId)) {
      topic.likes.pull(userId);
    }

    topic.dislikes.push(userId); 
    await topic.save();

    res.status(200).json({
      message: "Topic disliked successfully.",
      likesCount: topic.likes.length,
      dislikesCount: topic.dislikes.length,
    });
  } catch (error) {
    console.error("Error disliking the topic:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});




router.get("/topics/:id/likes", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const topic = await Topic.findById(id).populate("likes", "_id");
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    const likeCount = topic.likes.length;

    res.json({ likeCount: likeCount });
  } catch (error) {
    console.error("Error fetching topic likes:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});




router.get("/topics/:id/dislikes", verifyToken, async (req, res) => {
  const { id } = req.params;

  if (req.user.isCompany) {
    return res
      .status(403)
      .json({ message: "Only users can view topic dislikes." });
  }

  try {
    const topic = await Topic.findById(id).populate("dislikes", "username");
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    const totalDislikes = topic.dislikes.length;

    res.json({ totalDislikes });
  } catch (error) {
    console.error("Error fetching topic dislikes:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});










router.post("/topics/:id/dislike", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body; 

  try {
    const topic = await Topic.findById(id);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }
    if (topic.dislikes.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You have already disliked this topic" });
    }

    const updatedTopic = await Topic.findByIdAndUpdate(
      id,
      { $push: { dislikes: userId } },
      { new: true }
    ).populate("dislikes", "-password"); 

    res.json(updatedTopic);
  } catch (error) {
    console.error("Error disliking the topic:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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