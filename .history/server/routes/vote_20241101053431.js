const express = require("express");
const router = express.Router();
const Topic = require("../model/topic"); 
const Vote = require("../model/Vote");
const Election = require("../model/electionModel");
const verifyToken = require("./verifyToken");
const { check, validationResult } = require("express-validator");


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

    let updated = false;
    let removed = false;

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
        removed = true;
      }
      topic.reactions.likes.push(userId);
      updated = true;
    }

    if (action === "dislike") {
      if (alreadyDisliked) {
        return res
          .status(400)
          .json({ message: "You have already disliked this topic." });
      }
      if (alreadyLiked) {
        topic.reactions.likes.pull(userId);
        removed = true;
      }
      topic.reactions.dislikes.push(userId);
      updated = true;
    }

    if (updated || removed) {
      topic.reactions.likeCount = topic.reactions.likes.length;
      topic.reactions.dislikeCount = topic.reactions.dislikes.length;
      await topic.save();
    }

    return res.status(200).json({
      message: `Topic ${action}d successfully.`,
      likesCount: topic.reactions.likeCount,
      dislikesCount: topic.reactions.dislikeCount,
      updated,
      removed,
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

  if (!["likes", "dislikes"].includes(action)) {
    return res
      .status(400)
      .json({ message: "Invalid action. Use 'likes' or 'dislikes'." });
  }

  try {
    const topic = await Topic.findById(id).populate(
      `reactions.${action}`,
      "username profilePicture"
    ); 
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    const reactionList = topic.reactions[action];
    const reactionCount = reactionList.length;

    return res.status(200).json({
      message: `Successfully fetched ${action} count.`,
      [`${action}Count`]: reactionCount,
      [action]: reactionList,
    });
  } catch (error) {
    console.error(`Error fetching topic ${action}:`, error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});






// POST A COMMENT ON A TOPIC
router.post(
  "/vote/topics/:topicId/comments/:commentId?",
  verifyToken,
  [check("text", "Text is required.").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { topicId, commentId } = req.params;
    const { text } = req.body;

    try {
      const topic = await Topic.findById(topicId);
      if (!topic) {
        return res.status(404).json({ message: "Topic not found." });
      }

      if (commentId) {
        // Adding a reply to an existing comment
        const comment = topic.comments.id(commentId);
        if (!comment) {
          return res.status(404).json({ message: "Comment not found." });
        }

        const reply = {
          user: req.user._id,
          text,
          createdAt: new Date(),
        };

        comment.replies.push(reply);
        await topic.save();

        return res.status(201).json({
          message: "Reply added successfully.",
          reply,
        });
      } else {
        // Adding a new comment to the topic
        const newComment = {
          user: req.user._id,
          text: text.trim(),
          createdAt: new Date(),
        };

        topic.comments.push(newComment);
        await topic.save();

        return res.status(201).json({
          message: "Comment added successfully.",
          comment: newComment,
        });
      }
    } catch (error) {
      console.error("Error:", error.message);
      return res.status(500).json({
        message: "Server error.",
        error: error.message,
      });
    }
  }
);




// GET COMMENTS FOR A TOPIC
router.get(
  "/topics/:topicId/comments/comment",
  verifyToken,
  async (req, res) => {
    const { topicId } = req.params;

    try {
      const topic = await Topic.findById(topicId).populate(
        "comments.user",
        "username firstName lastName profilePicture"
      ); // Added profilePicture field

      if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
      }

      const sortedComments = topic.comments.sort(
        (a, b) => b.createdAt - a.createdAt
      );

      return res.status(200).json({
        message: "Comments fetched successfully.",
        comments: sortedComments,
      });
    } catch (error) {
      console.error("Error fetching comments:", error.message);
      return res
        .status(500)
        .json({ message: "Server error.", error: error.message });
    }
  }
);


// GET TOPIC REPLY ON A COMMENT
router.get(
  "/topics/:topicId/comments/:commentId/reply",
  verifyToken,
  async (req, res) => {
    const { topicId, commentId } = req.params;

    // Check if req.user is populated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: User not found." });
    }

    try {
      const topic = await Topic.findById(topicId);
      if (!topic) {
        return res.status(404).json({ message: "Topic not found." });
      }

      const comment = topic.comments.id(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found." });
      }

      // Return the replies for the specified comment
      return res.status(200).json({ replies: comment.replies });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to fetch replies." });
    }
  }
);



// HANDLE LIKES AND DISLIKES ON A COMMENT
router.post(
  "/vote/topics/:topicId/comments/:commentId/:action",
  verifyToken,
  async (req, res) => {
    const { topicId, commentId, action } = req.params;

    // Log the incoming request details
    console.log(
      `Received request for action: ${action} on comment ID: ${commentId} in topic ID: ${topicId} from user ID: ${req.user._id}`
    );

    if (!["like", "dislike"].includes(action)) {
      console.error(`Invalid action received: ${action}`);
      return res
        .status(400)
        .json({ message: "Invalid action. Use 'like' or 'dislike'." });
    }

    try {
      const topic = await Topic.findById(topicId);
      if (!topic) {
        console.error(`Topic not found: ${topicId}`);
        return res.status(404).json({ message: "Topic not found" });
      }

      const comment = topic.comments.id(commentId);
      if (!comment) {
        console.error(`Comment not found: ${commentId} in topic: ${topicId}`);
        return res.status(404).json({ message: "Comment not found" });
      }

      // Log current likes and dislikes before modification
      console.log(
        `Current likes: ${comment.reactions.likes}, Current dislikes: ${comment.reactions.dislikes}`
      );

      // Handle the action
      if (action === "like") {
        if (!comment.reactions.likes.includes(req.user._id)) {
          comment.reactions.likes.push(req.user._id);
          // Remove user from dislikes if they had previously disliked the comment
          comment.reactions.dislikes = comment.reactions.dislikes.filter(
            (id) => !id.equals(req.user._id)
          );
          comment.reactions.likeCount = comment.reactions.likes.length;
          comment.reactions.dislikeCount = comment.reactions.dislikes.length;
          console.log(`User ${req.user._id} liked comment ID: ${commentId}`);
        } else {
          console.log(
            `User ${req.user._id} has already liked comment ID: ${commentId}`
          );
        }
      } else if (action === "dislike") {
        if (!comment.reactions.dislikes.includes(req.user._id)) {
          comment.reactions.dislikes.push(req.user._id);
          // Remove user from likes if they had previously liked the comment
          comment.reactions.likes = comment.reactions.likes.filter(
            (id) => !id.equals(req.user._id)
          );
          comment.reactions.likeCount = comment.reactions.likes.length;
          comment.reactions.dislikeCount = comment.reactions.dislikes.length;
          console.log(`User ${req.user._id} disliked comment ID: ${commentId}`);
        } else {
          console.log(
            `User ${req.user._id} has already disliked comment ID: ${commentId}`
          );
        }
      }

      // Save the topic with updated likes/dislikes
      await topic.save();
      console.log(
        `Successfully processed ${action} on comment ID: ${commentId}`
      );

      return res
        .status(200)
        .json({ message: `Comment ${action}d successfully.`, comment });
    } catch (error) {
      console.error(`Error processing ${action} on comment:`, error.message);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }
);






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