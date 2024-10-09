const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Conversation = require("../model/conversation");
const Message = require("../model/message");
const verifyToken = require("./verifyToken");
const ObjectId = mongoose.Types.ObjectId; 


// Send a message
 router.get("/messages/sent", verifyToken, async (req, res) => {
  const { _id: senderId } = req.user;

  try {
    // Fetch sent messages by sender
    const sentMessages = await Message.find({ sender: senderId })
      .populate("recipient", "username firstName lastName")
      .sort({ createdAt: -1 });

    // Handle case where no messages are found
    if (!sentMessages.length) {
      return res.status(404).json({ message: "No sent messages found." });
    }

    res.status(200).json(sentMessages);
  } catch (error) {
    console.error("Error fetching sent messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




// Fetch messages in a conversation
router.get("/messages/:conversationId", verifyToken, async (req, res) => {
  const { conversationId } = req.params;

  // Validate if conversationId is a valid ObjectId
  if (!ObjectId.isValid(conversationId)) {
    return res.status(400).json({
      error: "Invalid conversation ID",
    });
  }

  try {
    const messages = await Message.find({
      conversation: conversationId,
    }).populate("sender", "username");

    if (!messages.length) {
      return res
        .status(404)
        .json({ error: "No messages found for this conversation." });
    }

    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages." });
  }
});




// Create a new conversation
router.post("/conversations", verifyToken, async (req, res) => {
  const { participantIds, title } = req.body;

  if (!participantIds || participantIds.length < 2) {
    return res.status(400).json({
      message: "At least two participants are required.",
    });
  }

  try {
    const conversation = new Conversation({
      participants: participantIds,
      title: title || "Untitled Conversation",
    });

    await conversation.save();
    res.status(201).json(conversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// Get conversations for the logged-in user
router.get("/conversations", verifyToken, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate("participants", "username firstName lastName")
      .sort({ lastUpdated: -1 });

    if (!conversations.length) {
      return res.status(404).json({ message: "No conversations found." });
    }

    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
