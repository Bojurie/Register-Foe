const express = require("express");
const router = express.Router();
const Topic = require("../model/topic"); 
const Vote = require("../model/Vote");
const Election = require("../model/electionModel");
const verifyToken = require("./verifyToken");
const { check, validationResult } = require("express-validator");



// POSTING COMMENT AND REPLYING TO COMMENT
router.post("/vote/topics/:topicId/comments/:commentId?", verifyToken, async (req, res) => {
  const { text } = req.body; // Extract text from the body
  const { topicId, commentId } = req.params; // Get topicId and commentId from URL params
  const userId = req.user.id; // Extract userId from the request context

  console.log("Received Comment Request:", { commentId, topicId });

  // Validate incoming data for potential errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found." });
    }

    // If commentId is provided, we're replying to a comment
    if (commentId) {
      const comment = topic.comments.id(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found." });
      }
      // Add reply to the existing comment
      comment.replies.push({ text, userId, createdAt: new Date() });
    } else {
      // Otherwise, create a new comment
      topic.comments.push({ text, userId, createdAt: new Date(), replies: [] });
    }

    await topic.save();
    return res.status(201).json({ message: "Comment submitted successfully." });
  } catch (error) {
    console.error("Error in comment handling:", error);
    return res.status(500).json({ message: "Server error." });
  }
});


// POST TOPIC
router.post("/vote/topics/:topicId/:action", verifyToken, async (req, res) => {
  const { topicId, action } = req.params;
  const userId = req.user._id.toString();

  // Check if action is valid
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

    // Determine opposite action
    const oppositeAction = action === "like" ? "dislike" : "like";
    const currentReactions = topic.reactions[action + "s"];
    const oppositeReactions = topic.reactions[oppositeAction + "s"];

    // Remove opposite reaction if present
    if (oppositeReactions.includes(userId)) {
      topic.reactions[oppositeAction + "s"] = oppositeReactions.filter(
        (id) => id.toString() !== userId
      );
      topic.reactions[oppositeAction + "Count"]--; // Decrement opposite count
    }

    // Add current reaction
    if (!currentReactions.includes(userId)) {
      currentReactions.push(userId);
      topic.reactions[action + "Count"]++; // Increment current count
    }

    // Save changes
    await topic.save();

    return res.status(200).json({
      message: `Topic ${action}d successfully.`,
      reactions: {
        likeCount: topic.reactions.likeCount,
        dislikeCount: topic.reactions.dislikeCount,
        likes: topic.reactions.likes,
        dislikes: topic.reactions.dislikes,
      },
    });
  } catch (error) {
    console.error(`Error processing ${action} on topic:`, error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});


// POST route for liking and disliking comments
router.post("/vote/topics/:topicId/comments/:commentId/:action", verifyToken, async (req, res) => {
  const { topicId, commentId, action } = req.params; // Get IDs and action from URL params
  const userId = req.user.id; // Extract userId from the request context

  console.log("Received Vote Request:", { commentId, topicId, action });

  // Validate action
  if (!["like", "dislike"].includes(action)) {
    return res.status(400).json({ message: "Invalid action. Use 'like' or 'dislike'." });
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

   const oppositeAction = action === "like" ? "dislike" : "like";
    const userAlreadyReacted = comment.reactions[action + "s"].includes(userId);

    if (userAlreadyReacted) {
      return res.status(400).json({ message: "You can only like a comment once." });
    }

    const oppositeUserIndex = comment.reactions[oppositeAction + "s"].indexOf(userId);
    if (oppositeUserIndex !== -1) {
      comment.reactions[oppositeAction + "s"].splice(oppositeUserIndex, 1);
      comment.reactions[oppositeAction + "Count"]--;
    }

    comment.reactions[action + "s"].push(userId);
    comment.reactions[action + "Count"]++;

    await topic.save();
    return res.status(200).json({ message: "Vote action performed successfully." });
  } catch (error) {
    console.error("Error in voting handling:", error);
    return res.status(500).json({ message: "Server error." });
  }
});










// GET COMMENTS FOR A TOPIC MAIN GET ROUTE  work(getting topic comments) 111111 get
router.get("/vote/topics/:topicId/comments", verifyToken, async (req, res) => {
  const { topicId } = req.params;
  const { onlyCount } = req.query;

  if (!topicId) {
    return res.status(400).json({ message: "Topic ID is required." });
  }

  try {
    const topic = await Topic.findById(topicId)
      .populate("comments.user", "username firstName lastName profilePicture")
      .populate(
        "comments.replies.user",
        "username firstName lastName profilePicture"
      );

    if (!topic) {
      return res.status(404).json({ message: "Topic not found." });
    }

    if (onlyCount === "true") {
      return res.status(200).json({
        message: "Comments count fetched successfully.",
        commentsCount: topic.comments.length,
      });
    }

    const formattedComments = topic.comments
      .filter((comment) => comment._id) // Ensure comment has an ID
      .map((comment) => ({
        id: comment._id,
        user: comment.user && {
          id: comment.user._id,
          username: comment.user.username,
          firstName: comment.user.firstName,
          lastName: comment.user.lastName,
          profilePicture: comment.user.profilePicture,
        },
        text: comment.text,
        createdAt: new Date(comment.createdAt),
        replies: comment.replies
          .filter((reply) => reply._id) // Ensure reply has an ID
          .map((reply) => ({
            id: reply._id,
            user: reply.user && {
              id: reply.user._id,
              username: reply.user.username,
              firstName: reply.user.firstName,
              lastName: reply.user.lastName,
              profilePicture: reply.user.profilePicture,
            },
            text: reply.text,
            createdAt: new Date(reply.createdAt),
          })),
      }))
      .sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json({
      message: "Comments and replies fetched successfully.",
      comments: formattedComments,
      commentsCount: formattedComments.length,
    });
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({
      message: "Server error.",
      error: err.message,
    });
  }
});




// Get reactions for a specific comment

router.get(
  "/vote/topics/:topicId/comments/:commentId/reactions",
  verifyToken,
  async (req, res) => {
    const { topicId, commentId } = req.params;

    // Validate that topicId and commentId are provided
    if (!topicId || !commentId) {
      return res
        .status(400)
        .json({ message: "Topic ID and Comment ID are required." });
    }

    try {
      // Log the topicId and commentId for debugging
      console.log(
        `Fetching reactions for Topic ID: ${topicId}, Comment ID: ${commentId}`
      );

      // Fetch the topic and populate the reactions
      const topic = await Topic.findById(topicId)
        .populate("comments.reactions.likes", "username profilePicture")
        .populate("comments.reactions.dislikes", "username profilePicture");

      // Log the topic retrieved from the database
      console.log("Fetched Topic:", topic);

      // Check if the topic exists
      if (!topic) {
        return res.status(404).json({ message: "Topic not found." });
      }

      // Find the specific comment by ID
      const comment = topic.comments.id(commentId);

      // Check if the comment exists
      if (!comment) {
        return res.status(404).json({ message: "Comment not found." });
      }

      // Map likes and dislikes to the desired structure
      const likes = comment.reactions.likes.map((user) => ({
        id: user._id,
        username: user.username,
        profilePicture: user.profilePicture,
      }));

      const dislikes = comment.reactions.dislikes.map((user) => ({
        id: user._id,
        username: user.username,
        profilePicture: user.profilePicture,
      }));

      // Log the likes and dislikes fetched
      console.log("Likes:", likes);
      console.log("Dislikes:", dislikes);

      // Respond with the fetched reactions
      res.status(200).json({
        message: "Reactions fetched successfully.",
        reactions: {
          likes,
          dislikes,
          likesCount: likes.length,
          dislikesCount: dislikes.length,
        },
      });
    } catch (err) {
      // Log the error and return a server error response
      console.error("Error fetching reactions:", err);
      res.status(500).json({
        message: "Server error.",
        error: err.message,
      });
    }
  }
);





// GETTING LIKE AND DISLIKES  works(getting likes and dislikes a topic)
router.get("/topics/:id/:action", verifyToken, async (req, res) => {
  const { id, action } = req.params;

  // Validate action parameter
  if (!["likes", "dislikes"].includes(action)) {
    return res
      .status(400)
      .json({ message: "Invalid action. Use 'likes' or 'dislikes'." });
  }

  try {
    // Find the topic by ID and populate the specified action (likes or dislikes) with user details
    const topic = await Topic.findById(id).populate(
      `reactions.${action}`,
      "username profilePicture"
    );

    // Check if topic exists
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    // Get reaction list and count for the specified action
    const reactionList = topic.reactions[action] || [];
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









module.exports = router