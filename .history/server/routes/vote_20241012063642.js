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

     if (!topic.reactions) {
       topic.reactions = {
         likes: [],
         dislikes: [],
         likeCount: 0,
         dislikeCount: 0,
       };
     }

     const alreadyLiked = topic.reactions.likes.some((like) =>
       like.equals(userId)
     );
     const alreadyDisliked = topic.reactions.dislikes.some((dislike) =>
       dislike.equals(userId)
     );

     if (action === "like") {
       if (alreadyLiked) {
         return res
           .status(400)
           .json({ message: "You have already liked this topic." });
       }

       if (alreadyDisliked) {
         topic.reactions.dislikes.pull(userId);
       }

       topic.reactions.likes.push(userId);
     }

     if (action === "dislike") {
       if (alreadyDisliked) {
         return res
           .status(400)
           .json({ message: "You have already disliked this topic." });
       }

       if (alreadyLiked) {
         topic.reactions.likes.pull(userId);
       }

       topic.reactions.dislikes.push(userId);
     }
     topic.reactions.likeCount = topic.reactions.likes.length;
     topic.reactions.dislikeCount = topic.reactions.dislikes.length;

     await topic.save();

     return res.status(200).json({
       message: `Topic ${action}d successfully.`,
       likesCount: topic.reactions.likeCount,
       dislikesCount: topic.reactions.dislikeCount,
     });
   } catch (error) {
     console.error(`Error processing ${action}:`, error);
     return res
       .status(500)
       .json({ message: "Server error", error: error.message });
   }
 });



// GETTING LIKE AND DISLIKES 
router.get("/topics/:id/:action", verifyToken, async (req, res) => {
  const { id, action } = req.params;

  console.log(`Incoming request for topicId: ${id}, action: ${action}`);

  if (!["likes", "dislikes"].includes(action)) {
    console.log("Invalid action:", action); 
    return res
      .status(400)
      .json({ message: "Invalid action. Use 'likes' or 'dislikes'." });
  }

  try {
    const topic = await Topic.findById(id);
    if (!topic) {
      console.log(`Topic with ID ${id} not found.`);
      return res.status(404).json({ message: "Topic not found" });
    }

    console.log(`Topic found: ${topic.title}`);

    const count = topic.reactions[action].length;

    return res.status(200).json({
      message: `Successfully fetched ${action} count.`,
      [`${action}Count`]: count,
      [`${action}`]: topic.reactions[action],
    });
  } catch (error) {
    console.error(`Error fetching topic ${action}:`, error); 
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});


// POST A COMMENT ON A TOPIC
router.post("/topics/:topicId/comments/comment", verifyToken, async (req, res) => {
  const { topicId } = req.params;
  const { text } = req.body;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ message: "Comment text is required." });
  }

  try {
    const topic = await Topic.findById(topicId);
    
    if (!topic) {
      return res.status(404).json({ message: "Topic not found." });
    }

    const newComment = {
      user: req.user._id, 
      text: text.trim(),
    };

    topic.comments.push(newComment);
    await topic.save(); 

    return res.status(201).json({
      message: "Comment added successfully.",
      comment: newComment,
    });
  } catch (error) {
    console.error("Error adding comment:", error.message);
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
});



// GET COMMENT ROUTE
// GET COMMENTS FOR A TOPIC
router.get("/topics/:topicId/comments/comment", verifyToken, async (req, res) => {
  const { topicId } = req.params;

  try {
    // Fetch the topic by ID and populate user details for each comment
    const topic = await Topic.findById(topicId).populate(
      "comments.user",
      "username firstName lastName"
    );

    // If the topic is not found, send a 404 response
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    // Respond with the comments array
    return res.status(200).json({
      message: "Comments fetched successfully.",
      comments: topic.comments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error.message);
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
});




// GET likes for a topic
// router.get("/topics/:topicId/likes", verifyToken, async (req, res) => {
//   const { topicId } = req.params;

//   try {
//     const topic = await Topic.findById(topicId);
//     if (!topic) {
//       return res.status(404).json({ message: "Topic not found" });
//     }

//     return res.status(200).json({
//       likesCount: topic.reactions.likeCount,
//       likes: topic.reactions.likes,
//     });
//   } catch (error) {
//     console.error("Error fetching likes:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// GET dislikes for a topic
// router.get("/topics/:topicId/dislikes", verifyToken, async (req, res) => {
//   const { topicId } = req.params;

//   try {
//     const topic = await Topic.findById(topicId);
//     if (!topic) {
//       return res.status(404).json({ message: "Topic not found" });
//     }

//     return res.status(200).json({
//       dislikesCount: topic.reactions.dislikeCount,
//       dislikes: topic.reactions.dislikes,
//     });
//   } catch (error) {
//     console.error("Error fetching dislikes:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });









// Route to handle like or dislike on a comment
// router.post(
//   "/vote/topics/:topicId/comments/:commentId/:action",
//   verifyToken,
//   async (req, res) => {
//     const { topicId, commentId, action } = req.params;
//     const userId = req.user._id;

//     if (!["like", "dislike"].includes(action)) {
//       return res
//         .status(400)
//         .json({ message: "Invalid action. Use 'like' or 'dislike'." });
//     }

//     try {
//       const topic = await Topic.findById(topicId);
//       if (!topic) {
//         return res.status(404).json({ message: "Topic not found" });
//       }

//       const comment = topic.comments.id(commentId);
//       if (!comment) {
//         return res.status(404).json({ message: "Comment not found" });
//       }

//       if (action === "like") {
//         comment.likes.push(userId);
//       } else {
//         comment.dislikes.push(userId);
//       }

//       await topic.save();

//       res
//         .status(200)
//         .json({ message: `Comment ${action}d successfully.`, comment });
//     } catch (error) {
//       console.error(`Error processing ${action} on comment:`, error.message);
//       res.status(500).json({ message: "Server error", error: error.message });
//     }
//   }
// );





// GET ALL LIKES AND DISLIKES
router.get("/vote/topics/:topicId/:action", verifyToken, async (req, res) => {
  const { topicId, action } = req.params;

  if (!["likes", "dislikes"].includes(action)) {
    return res
      .status(400)
      .json({ message: "Invalid action. Use 'likes' or 'dislikes'." });
  }

  try {
    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    const count = topic.reactions[`${action}Count`];
    const users = topic.reactions[action];

    return res.status(200).json({
      message: `Successfully fetched ${action}.`,
      count,
      users,
    });
  } catch (error) {
    console.error(`Error fetching ${action}:`, error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});












// router.post(
//   "/vote/:electionId/:candidateId",
//   async (req, res) => {
//     try {
//       const { electionId, candidateId } = req.params;
//       const userId = req.user._id;

//       const election = await Election.findById(electionId);
//       if (!election) {
//         return res.status(404).json({ error: "Election not found" });
//       }

//       const hasVoted = await Vote.findOne({
//         election: electionId,
//         voter: userId,
//       });
//       if (hasVoted) {
//         return res.status(400).json({ error: "Already voted" });
//       }

//       const newVote = new Vote({
//         election: electionId,
//         candidate: candidateId,
//         voter: userId,
//       });

//       await newVote.save();

//       res.status(200).json({ message: "Vote recorded successfully" });
//     } catch (error) {
//       console.error("Error recording vote:", error);
//       res.status(500).json({ error: "Failed to record vote" });
//     }
//   }
// );


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