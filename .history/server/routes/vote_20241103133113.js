const express = require("express");
const router = express.Router();
const Topic = require("../model/topic"); 
const Vote = require("../model/Vote");
const Election = require("../model/electionModel");
const verifyToken = require("./verifyToken");
const { check, validationResult } = require("express-validator");




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
        (id) => id !== userId
      );
      topic.reactions[oppositeAction + "Count"]--;
    }

    // Add current reaction
    if (!currentReactions.includes(userId)) {
      currentReactions.push(userId);
      topic.reactions[action + "Count"]++;
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



// POSTING COMMENT AND REPLYING TO COMMENT
router.post(
  "/vote/topics/:topicId/comments/:commentId?/:action?",
  verifyToken,
  async (req, res) => {
    const { text } = req.body; // Extract text from the body
    const { topicId, commentId, action } = req.params; // Get IDs and action from URL params
    const userId = req.user.id; // Extract userId from the request context

    console.log("Received Vote Request:", { commentId, topicId, action });

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

      // Handle voting actions
      if (commentId && action) {
        const comment = topic.comments.id(commentId);
        if (!comment) {
          return res.status(404).json({ message: "Comment not found." });
        }

        // Ensure action is valid
        if (action === "like" || action === "dislike") {
          const oppositeAction = action === "like" ? "dislike" : "like";
          const userAlreadyReacted =
            comment.reactions[action + "s"].includes(userId);

          // Check if the user has already liked or disliked the comment
          if (userAlreadyReacted) {
            return res
              .status(400)
              .json({ message: "You can only like a comment once." });
          }

          // Remove the user's reaction if they had the opposite one
          const oppositeUserIndex =
            comment.reactions[oppositeAction + "s"].indexOf(userId);
          if (oppositeUserIndex !== -1) {
            comment.reactions[oppositeAction + "s"].splice(
              oppositeUserIndex,
              1
            );
            comment.reactions[oppositeAction + "Count"]--;
          }

          // Add the user's like
          comment.reactions[action + "s"].push(userId);
          comment.reactions[action + "Count"]++;

          await topic.save();
          return res
            .status(200)
            .json({ message: "Like action performed successfully." });
        }
      }

      return res.status(400).json({ message: "No action performed." });
    } catch (error) {
      console.error("Error in comment handling:", error);
      return res.status(500).json({ message: "Server error." });
    }
  }
);







// GET COMMENTS FOR A TOPIC MAIN GET ROUTE  work(getting topic comments) 111111 get
router.get("/vote/topics/:topicId/comments", verifyToken, async (req, res) => {
  const { topicId } = req.params;
  const { onlyCount } = req.query;

  // Validate topicId
  if (!topicId) {
    return res.status(400).json({ message: "Topic ID is required." });
  }

  try {
    // Fetch the topic and populate comments with user, replies, and reactions
    const topic = await Topic.findById(topicId)

      .populate({
        path: "comments.user",
        select: "username firstName lastName profilePicture",
      })
      .populate({
        path: "comments.replies.user",
        select: "username firstName lastName profilePicture",
      })
      .populate({
        path: "comments.reactions.likes",
        select: "username profilePicture",
      })
      .populate({
        path: "comments.reactions.dislikes",
        select: "username profilePicture",
      })
      .exec();
    console.log("Comments fetched from the database:", topic); // Log the comments

    // Handle topic not found
    if (!topic) {
      return res.status(404).json({ message: "Topic not found." });
    }

    // If onlyCount is true, return count of comments
    if (onlyCount === "true") {
      return res.status(200).json({
        message: "Comments count fetched successfully.",
        commentsCount: topic.comments.length,
      });
    }

    // Format comments with user and replies information
    const formattedComments = topic.comments
      .map((comment) => {
        const commentUser = comment.user
          ? {
              id: comment.user._id,
              username: comment.user.username,
              firstName: comment.user.firstName,
              lastName: comment.user.lastName,
              profilePicture: comment.user.profilePicture,
            }
          : null;

        const replies = comment.replies
          ? comment.replies.map((reply) => {
              const replyUser = reply.user
                ? {
                    id: reply.user._id,
                    username: reply.user.username,
                    firstName: reply.user.firstName,
                    lastName: reply.user.lastName,
                    profilePicture: reply.user.profilePicture,
                  }
                : null;

              return {
                id: reply._id,
                user: replyUser,
                text: reply.text,
                createdAt: new Date(reply.createdAt),
                likesCount: reply.reactions.likes.length || 0,
                dislikesCount: reply.reactions.dislikes.length || 0,
              };
            })
          : [];

        return {
          id: comment._id,
          user: commentUser,
          text: comment.text,
          createdAt: new Date(comment.createdAt),
          replies,
          likesCount: comment.reactions.likes.length || 0,
          dislikesCount: comment.reactions.dislikes.length || 0,
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt); // Sort comments by creation date

    // Return formatted comments
    return res.status(200).json({
      message: "Comments and replies fetched successfully.",
      comments: formattedComments,
      commentsCount: formattedComments.length,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({
      message: "Server error.",
      error: error.message,
    });
  }
});




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