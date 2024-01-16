const express = require("express");
const Topic = require("../model/topic"); 
const verifyToken = require("./verifyToken");
const Company = require("../model/companySchema");
const router = express.Router();





router.post("/topics",verifyToken, async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "You must be logged in to create a topic." });
  }
  const { title, dateStart, dateEnd, description, companyCode } = req.body;

  // Basic validation for required fields
  if (!title || !description || !companyCode) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newTopic = new Topic({
      title,
      dateStart,
      dateEnd,
      description,
      companyCode,
      createdBy: req.user._id, // Ensure req.user is populated by your auth middleware
    });

    await newTopic.save();
    res.status(201).json(newTopic);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating topic", error: error.message });
  }
});


router.get("/topics",  async (req, res) => {
  try {
    const companyCode = req.query.companyCode;
    if (!companyCode) {
      return res.status(400).json({ error: "Company code is required" });
    }

    // Assuming Topic is your model and it has a companyCode field
    const topics = await Topic.find({ companyCode: companyCode });

    if (!topics.length) {
      return res
        .status(404)
        .json({ error: "No topics found for this company code" });
    }

    res.status(200).json(topics);
  } catch (error) {
    console.error("Error fetching topics:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// Apply the authentication middleware to the route
// router.get("/topics/byCompanyCode", authenticateJWT, async (req, res) => {
//   if (!req.user || !req.user.companyCode) {
//     return res.status(400).json({ error: "Company code is required" });
//   }
//   const { companyCode } = req.user;

//   try {
//     const topics = await Topic.find({ companyCode });
//     res.status(200).json(topics);
//   } catch (error) {
//     console.error("Error retrieving topics:", error.message);
//     res.status(500).json({ error: "Failed to retrieve topics" });
//   }
// });


router.get("/topics/byCompanyCode", verifyToken, async (req, res) => {
  try {
  

    const users = await Topic.find({ companyCode: req.user.companyCode });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error retrieving users:", error.message);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
});


router.get("/topics/:id", verifyToken, async (req, res) => {
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
router.put("/topics/:id", verifyToken, async (req, res) => {
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
router.delete("/topics/:id", verifyToken, async (req, res) => {
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
router.post("/topics/:id/like", verifyToken, async (req, res) => {
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
router.post("/topics/:id/vote", verifyToken, async (req, res) => {
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
