const express = require("express");
const router = express.Router();
const Topic = require("../model/topic"); 
const Vote = require("../model/Vote");
const Election = require("../model/electionModel");
const verifyToken = require("./verifyToken");
const { check, validationResult } = require("express-validator");




// POST TOPIC
router.post("/topics", verifyToken, async (req, res) => {
  try {
    if (!req.user.isCompany && !req.user.isAdmin) {
      console.error("Unauthorized attempt to create a topic by:", req.user._id);
      return res
        .status(403)
        .json({ message: "You do not have permission to create a topic." });
    }

    const { title, dateStart, dateEnd, description, companyCode } = req.body;
    const sanitizedTitle = title ? title.trim() : null;
    const sanitizedDescription = description ? description.trim() : null;

    if (!sanitizedTitle || !sanitizedDescription || !companyCode) {
      console.error("Validation failed: Missing required fields");
      return res.status(400).json({
        message:
          "Missing required fields: title, description, or company code.",
      });
    }

    if (dateStart && dateEnd) {
      const startDate = new Date(dateStart);
      const endDate = new Date(dateEnd);
      const now = new Date();

      if (startDate < now) {
        console.error("Validation failed: Start date is in the past");
        return res
          .status(400)
          .json({ message: "Start date cannot be in the past." });
      }

      if (endDate <= startDate) {
        console.error("Validation failed: End date must be after start date");
        return res
          .status(400)
          .json({ message: "End date must be after the start date." });
      }
    }

    const newTopic = new Topic({
      title: sanitizedTitle,
      dateStart,
      dateEnd,
      description: sanitizedDescription,
      companyCode,
      createdBy: req.user._id,
    });

    await newTopic.save();
    res.status(201).json(newTopic);
  } catch (error) {
    console.error("Error creating topic:", error);
    res
      .status(500)
      .json({ message: "Error creating topic", error: error.message });
  }
});


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


// MAIN POST TOPIC ROUTE 
router.post("/vote/topics/:topicId/:action", verifyToken, async (req, res) => {
  const { topicId, action } = req.params;
  const userId = req.user._id;

  console.log(
    `Received request for action: ${action} on topic ID: ${topicId} from user ID: ${userId}`
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

    const updateReactionCounts = () => {
      topic.reactions[action + "s"].push(userId); // e.g., likes or dislikes
      topic.reactions[action + "Count"] = topic.reactions[action + "s"].length;

      // Remove user from the opposite reaction if it exists
      const oppositeAction = action === "like" ? "dislike" : "like";
      topic.reactions[oppositeAction + "s"] = topic.reactions[
        oppositeAction + "s"
      ].filter((id) => !id.equals(userId));
      topic.reactions[oppositeAction + "Count"] =
        topic.reactions[oppositeAction + "s"].length;

      console.log(`User ${userId} ${action}d topic ID: ${topicId}`);
    };

    if (!topic.reactions[action + "s"].includes(userId)) {
      updateReactionCounts();
    } else {
      console.log(`User ${userId} has already ${action}d topic ID: ${topicId}`);
    }

    // Save the topic with updated likes/dislikes
    await topic.save();
    console.log(`Successfully processed ${action} on topic ID: ${topicId}`);

    return res.status(200).json({
      message: `Topic ${action}d successfully.`,
      likeCount: topic.reactions.likeCount,
      dislikeCount: topic.reactions.dislikeCount,
      likes: topic.reactions.likes,
      dislikes: topic.reactions.dislikes,
    });
  } catch (error) {
    console.error(`Error processing ${action} on topic:`, error.message);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});



// GETTING LIKE AND DISLIKES  works(getting likes and dislikes a topic)
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







// POST A COMMENT ON A TOPIC work(posting comment on a topic)
router.post(
  "/topics/:topicId/comments/:commentId?",
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




// GET COMMENTS FOR A TOPIC MAIN GET ROUTE  work(getting topic comments)
router.get("/vote/topics/:topicId/comments", verifyToken, async (req, res) => {
  const { topicId } = req.params;

  if (!topicId) {
    return res.status(400).json({ message: "Topic ID is required." });
  }

  try {
    const topic = await Topic.findById(topicId)
      .populate({
        path: "comments.user",
        select: "username firstName lastName profilePicture",
      })
      .populate({
        path: "comments.reactions.likes",
        select: "username profilePicture",
      })
      .populate({
        path: "comments.reactions.dislikes",
        select: "username profilePicture",
      });

    if (!topic) {
      return res.status(404).json({ message: "Topic not found." });
    }

    const sortedComments = topic.comments
      .map((comment) => ({
        ...comment.toObject(),
        replies: comment.replies.sort((a, b) => b.createdAt - a.createdAt),
        likesCount: comment.reactions.likes.length,
        dislikesCount: comment.reactions.dislikes.length,
      }))
      .sort((a, b) => b.createdAt - a.createdAt);

    return res.status(200).json({
      message: "Comments and replies fetched successfully.",
      comments: sortedComments,
      commentsCount: topic.comments.length,
    });
  } catch (error) {
    console.error("Error fetching comments:", error.message);
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
});








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