const express = require("express");
const Topic = require("../model/topic"); 
const router = express.Router();


router.post("/topics", async (req, res) => {
  try {
    const { title, dateStart, dateEnd, description } = req.body;

    // Validation for required fields
    if (!title || !dateStart || !dateEnd || !description) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Function to validate date format
    const isDateValid = (date) => {
      return !isNaN(Date.parse(date));
    };

    // Validate date format
    if (!isDateValid(dateStart) || !isDateValid(dateEnd)) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    // Ensure start date is not after end date
    if (new Date(dateStart) > new Date(dateEnd)) {
      return res
        .status(400)
        .json({ error: "Start date must be before end date" });
    }

    // Create and save the new topic
    const topic = new Topic({
      title,
      dateStart,
      dateEnd,
      description,
    });
    await topic.save();

    // Send successful response
    res.status(201).json(topic);
  } catch (error) {
    console.error("Error creating topic:", error);
    // Use a 500 status code for server-side errors
    res.status(500).json({ message: "Internal Server Error" });
  }
});



router.get("/topics", async (req, res) => {
  try {
    const topics = await Topic.find();
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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
