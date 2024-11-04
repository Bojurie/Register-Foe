const express = require("express");
const router = express.Router();
const Topic = require("../model/topic"); 
const moment = require("moment");
const verifyToken = require("./verifyToken");

// CREATE NEW TOPIC
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
      return res
        .status(400)
        .json({
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


// GET TOPIC BY COMPANY CODE
router.get(
  "/topics/byCompanyCode/:companyCode",
  verifyToken,
  async (req, res) => {
    const requestedCompanyCode = req.params.companyCode; // Getting the requested company code from request params
    const userCompanyCode = req.user.companyCode; // Assuming user information is attached to req.user
    const role = req.user.role; // Assuming role is also part of user information

    try {
      // Check if requested company code is provided
      if (!requestedCompanyCode) {
        console.warn("Company code is missing in request parameters.");
        return res.status(400).json({ message: "Company code is required." });
      }

      // Validate user access based on company code and role
      if (requestedCompanyCode !== userCompanyCode && role !== "Admin") {
        return res
          .status(403)
          .json({ error: "You do not have access to this company's topics." });
      }

      // Fetch topics for the specified company code
      const topics = await Topic.find(
        { companyCode: requestedCompanyCode },
        "title dateStart dateEnd description likeCount dislikeCount comments"
      ).sort({ dateStart: -1 });

      // Check if topics were found
      if (!topics.length) {
        console.warn(
          `No topics found for company code: ${requestedCompanyCode}`
        );
        return res.status(200).json({
          topics: [],
          message: "No topics found for this company.",
        });
      }

      // Return found topics
      return res.status(200).json({ topics });
    } catch (error) {
      console.error("Error fetching topics for company code:", error.message);
      return res.status(500).json({
        message: "Error fetching topics.",
        error: error.message,
      });
    }
  }
);







// Like a Topic
router.post("/topics/:topicId/like", verifyToken, async (req, res) => {
  try {
    const { topicId } = req.params;

    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    await topic.like(req.user._id);
    res
      .status(200)
      .json({
        message: "Topic liked successfully",
        likeCount: topic.likeCount,
      });
  } catch (error) {
    console.error("Error liking topic:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Dislike a Topic
router.post("/topics/:topicId/dislike", verifyToken, async (req, res) => {
  try {
    const { topicId } = req.params;

    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    await topic.dislike(req.user._id);
    res
      .status(200)
      .json({
        message: "Topic disliked successfully",
        dislikeCount: topic.dislikeCount,
      });
  } catch (error) {
    console.error("Error disliking topic:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Add a Comment to a Topic
router.post("/topics/:topicId/comments", verifyToken, async (req, res) => {
  const { topicId } = req.params;
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Comment text is required" });
  }

  try {
    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    await topic.addComment(req.user._id, text.trim());
    res.status(201).json({
      message: "Comment added successfully",
      comments: topic.comments,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



// Get Comments for a Topic
router.get("/topics/:topicId/comments", async (req, res) => {
  try {
    const { topicId } = req.params;

    const topic = await Topic.findById(topicId).populate(
      "comments.user",
      "firstName lastName email"
    );
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.status(200).json(topic.comments);
  } catch (error) {
    console.error("Error fetching comments for topic:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete a Topic
router.delete("/topics/:topicId", verifyToken, async (req, res) => {
  if (!req.user.isCompany && !req.user.isAdmin) {
    return res
      .status(403)
      .json({ message: "You do not have permission to delete a topic." });
  }

  try {
    const { topicId } = req.params;

    const topic = await Topic.findByIdAndDelete(topicId);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.status(200).json({ message: "Topic deleted successfully" });
  } catch (error) {
    console.error("Error deleting topic:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
