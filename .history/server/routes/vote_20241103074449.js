const express = require("express");
const router = express.Router();
const Topic = require("../model/topic"); 
const Vote = require("../model/Vote");
const Election = require("../model/electionModel");
const verifyToken = require("./verifyToken");
const { check, validationResult } = require("express-validator");




// POST TOPIC
router.post("/vote/topics/:topicId?/:action?", verifyToken, async (req, res) => {
  const { topicId, action } = req.params;
  const userId = req.user._id.toString();

  // Handle posting a new topic
  if (!topicId) {
    try {
      if (!req.user.isCompany && !req.user.isAdmin) {
        console.error("Unauthorized attempt to create a topic by:", userId);
        return res
          .status(403)
          .json({ message: "You do not have permission to create a topic." });
      }

      const { title, dateStart, dateEnd, description, companyCode } = req.body;
      const sanitizedTitle = title?.trim();
      const sanitizedDescription = description?.trim();

      // Validation for required fields
      if (!sanitizedTitle || !sanitizedDescription || !companyCode) {
        console.error("Validation failed: Missing required fields");
        return res
          .status(400)
          .json({
            message:
              "Missing required fields: title, description, or company code.",
          });
      }

      // Date validation
      if (dateStart && dateEnd) {
        const startDate = new Date(dateStart);
        const endDate = new Date(dateEnd);
        const now = new Date();
        if (startDate < now || endDate <= startDate) {
          console.error("Date validation failed");
          return res.status(400).json({ message: "Invalid dates provided." });
        }
      }

      // Save new topic
      const newTopic = new Topic({
        title: sanitizedTitle,
        dateStart,
        dateEnd,
        description: sanitizedDescription,
        companyCode,
        createdBy: userId,
      });
      await newTopic.save();
      return res.status(201).json(newTopic);
    } catch (error) {
      console.error("Error creating topic:", error);
      return res
        .status(500)
        .json({ message: "Error creating topic", error: error.message });
    }
  }

  // Handle adding a reaction to an existing topic
  if (topicId && action) {
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

      const oppositeAction = action === "like" ? "dislike" : "like";
      const currentReactions = topic.reactions[action + "s"];
      const oppositeReactions = topic.reactions[oppositeAction + "s"];

      // Remove opposite reaction if present
      if (oppositeReactions.includes(userId)) {
        topic.reactions[oppositeAction + "s"] = oppositeReactions.filter(
          (id) => id !== userId
        );
        topic.reactions[oppositeAction + "Count"] =
          topic.reactions[oppositeAction + "s"].length;
      }

      // Add or confirm the current reaction
      if (!currentReactions.includes(userId)) {
        currentReactions.push(userId);
        topic.reactions[action + "Count"] = currentReactions.length;
      }

      // Save the topic with updated reactions
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
  }

  return res
    .status(400)
    .json({
      message: "Invalid request. Provide a topic ID or specify an action.",
    });
});


// POSTING COMMENT AND REPLYING TO COMMENT
router.post(
  "/vote/topics/:topicId/comments/:commentId?/:action?",
  verifyToken,
  [
    check("text", "Text is required.").optional({ nullable: true }).notEmpty(),
    check("action").optional().isIn(["like", "dislike"]),
  ],
  async (req, res) => {
    const { topicId, commentId, action } = req.params;
    const { text } = req.body;
    const userId = req.user._id.toString();

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const topic = await Topic.findById(topicId);
      if (!topic) return res.status(404).json({ message: "Topic not found" });

      // Case 1: Adding a new comment to the topic
      if (!commentId && !action) {
        if (!text)
          return res
            .status(400)
            .json({ message: "Text is required to post a comment" });

        const newComment = {
          user: userId,
          text: text.trim(),
          createdAt: new Date(),
          reactions: { likes: [], dislikes: [], likeCount: 0, dislikeCount: 0 },
          replies: [],
        };

        topic.comments.push(newComment);
        await topic.save();
        return res.status(201).json({
          message: "Comment added successfully.",
          comment: topic.comments[topic.comments.length - 1],
        });
      }

      const comment = topic.comments.id(commentId);
      if (!comment)
        return res.status(404).json({ message: "Comment not found" });

      // Case 2: Reacting to a comment (like/dislike)
      if (action) {
        const oppositeAction = action === "like" ? "dislike" : "like";
        const userReactedOpposite =
          comment.reactions[`${oppositeAction}s`].includes(userId);

        // Remove the opposite reaction if it exists
        if (userReactedOpposite) {
          comment.reactions[`${oppositeAction}s`] = comment.reactions[
            `${oppositeAction}s`
          ].filter((id) => id.toString() !== userId);
        }

        // Handle current action
        const userReacted = comment.reactions[`${action}s`].includes(userId);
        if (!userReacted) {
          comment.reactions[`${action}s`].push(userId);
        } else {
          console.log(
            `User ${userId} has already ${action}d comment ID: ${commentId}`
          );
        }

        // Update counts
        comment.reactions.likeCount = comment.reactions.likes.length;
        comment.reactions.dislikeCount = comment.reactions.dislikes.length;
        await topic.save();

        return res.status(200).json({
          message: `Comment ${action}d successfully.`,
          reactions: comment.reactions,
        });
      }

      // Case 3: Replying to a comment
      if (text) {
        const newReply = {
          user: userId,
          text: text.trim(),
          createdAt: new Date(),
          reactions: { likes: [], dislikes: [], likeCount: 0, dislikeCount: 0 },
        };

        comment.replies.push(newReply);
        await topic.save();

        return res.status(201).json({
          message: "Reply added successfully.",
          reply: comment.replies[comment.replies.length - 1],
        });
      }

      // If no valid operation was determined
      return res.status(400).json({ message: "Invalid request parameters." });
    } catch (error) {
      console.error("Error handling request:", error.message);
      return res.status(500).json({
        message: "Server error.",
        error: error.message,
      });
    }
  }
);




// GET COMMENTS FOR A TOPIC MAIN GET ROUTE  work(getting topic comments) 111111 get
router.get("/vote/topics/:topicId/comments", verifyToken, async (req, res) => {
  const { topicId } = req.params;
  const { onlyCount } = req.query;

  console.log(
    "Received request for topic:",
    topicId,
    "with onlyCount:",
    onlyCount
  );

  if (!topicId) {
    console.log("No Topic ID provided.");
    return res.status(400).json({ message: "Topic ID is required." });
  }

  try {
    const topic = await Topic.findById(topicId);

    if (!topic) {
      console.log("Topic not found with ID:", topicId);
      return res.status(404).json({ message: "Topic not found." });
    }

    // Log when only the comment count is requested
    if (onlyCount === "true") {
      console.log("Returning only the comments count:", topic.comments.length);
      return res.status(200).json({
        message: "Comments count fetched successfully.",
        commentsCount: topic.comments.length,
      });
    }

    // Fetch full comments along with replies and populate necessary fields
    const fullTopic = await Topic.findById(topicId)
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

    console.log("Full topic with populated comments:", fullTopic);

    // Format comments with their replies included
    const formattedComments = fullTopic.comments
      .map((comment) => ({
        ...comment.toObject(),
        replies: comment.replies
          ? comment.replies
              .map((reply) => ({
                ...reply.toObject(),
                likesCount: reply.reactions?.likes?.length || 0,
                dislikesCount: reply.reactions?.dislikes?.length || 0,
              }))
              .sort((a, b) => b.createdAt - a.createdAt) // Sort replies by creation date
          : [],
        likesCount: comment.reactions?.likes?.length || 0,
        dislikesCount: comment.reactions?.dislikes?.length || 0,
      }))
      .sort((a, b) => b.createdAt - a.createdAt); // Sort comments by creation date

    console.log("Formatted comments ready to be sent:", formattedComments);

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