const express = require("express");
const router = express.Router();
const Conversation = require("../model/conversation");
const Message = require("../model/message");
const verifyToken = require("./verifyToken");

// Start a new conversation
router.post("/conversation", verifyToken, async (req, res) => {
  const { participantIds, title } = req.body;

  try {
    const conversation = new Conversation({
      participants: participantIds,
      title,
    });
    await conversation.save();

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// sending messing
router.post("/message", verifyToken, async (req, res) => {
  const { conversationId, content } = req.body;
  const senderId = req.user._id;

  if (!conversationId || !content) {
    return res
      .status(400)
      .json({ message: "Conversation ID and content are required." });
  }

  try {
    const message = new Message({
      conversation: conversationId,
      sender: senderId,
      content,
    });
    await message.save();

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: content,
      lastUpdated: Date.now(),
    });

    res.status(201).json({ message });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get reminders by user ID (simulated as messages for a specific user)
router.get("/reminder/reminders/:userId", verifyToken, async (req, res) => {
  const { userId } = req.params;

  if (req.user._id.toString() !== userId) {
    return res
      .status(403)
      .json({ message: "Unauthorized to access these reminders." });
  }

  try {
    const reminders = await Message.find({ sender: userId });
    res.status(200).json({ reminders });
  } catch (error) {
    console.error("Error fetching reminders:", error);
    res.status(500).json({ error: "Failed to fetch reminders" });
  }
});


// Get messages by user ID
router.get("/messages/:userId", verifyToken, async (req, res) => {
  const { userId } = req.params;

  if (req.user._id.toString() !== userId) {
    return res
      .status(403)
      .json({ message: "Unauthorized to access messages for this user." });
  }

  try {
    const messages = await Message.find({ sender: userId })
      .populate("conversation")
      .exec();
    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});


// Get all conversations for a user
router.get("/conversations", verifyToken, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate("participants", "username role")
      .sort({ lastUpdated: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all messages in a conversation
router.get("/conversation/:id/messages", verifyToken, async (req, res) => {
  try {
    const messages = await Message.find({
      conversation: req.params.id,
    })
      .populate("sender", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
