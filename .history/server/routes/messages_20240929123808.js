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

// Send a message
router.post("/message", verifyToken, async (req, res) => {
  const { conversationId, content } = req.body;
  const senderId = req.user._id;

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

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
