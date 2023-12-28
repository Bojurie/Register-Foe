const express = require("express");
const Topic = require("../model/topic"); 
const router = express.Router();


// POST route to create a new topic
router.post("/topics", async (req, res) => {
  try {
    const topic = new Topic(req.body);
    await topic.save();
    res.status(201).json(topic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET route to retrieve all topics
router.get("/topics", async (req, res) => {
  try {
    const topics = await Topic.find();
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET route to retrieve a single topic by ID
router.get("/topics/:id", async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }
    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT route to update a topic
router.put("/topics/:id", async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }
    Object.assign(topic, req.body);
    await topic.save();
    res.json(topic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE route to delete a topic
router.delete("/topics/:id", async (req, res) => {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }
    res.json({ message: "Topic deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST route to like a topic
router.post("/topics/:id/like", async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }
    if (!topic.likes.includes(req.body.userId)) {
      topic.likes.push(req.body.userId);
      await topic.save();
    }
    res.json(topic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST route to vote on a topic
router.post("/topics/:id/vote", async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }
    const vote = { user: req.body.userId, vote: req.body.vote };
    topic.votes.push(vote);
    await topic.save();
    res.json(topic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
