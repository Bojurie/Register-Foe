const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Conversation = require("../model/conversation");
const Message = require("../model/message");
const verifyToken = require("./verifyToken");
const ObjectId = mongoose.Types.ObjectId; 


// GET SENT MESSAGE
router.get("/messages/sent", verifyToken, async (req, res) => {
  const { _id: senderId } = req.user;

  try {
    const sentMessages = await Message.find({ sender: senderId })
      .populate("recipient", "firstName lastName username")
      .sort({ createdAt: -1 });

    if (!sentMessages.length) {
      return res.status(404).json({ message: "No sent messages found." });
    }

    res.status(200).json(sentMessages);
  } catch (error) {
    console.error("Error fetching sent messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// SEND A MESSAGE
router.post("/messages", verifyToken, async (req, res) => {
  const { conversationId, content, recipientId } = req.body;
  const senderId = req.user._id;

  if (!conversationId || !content || !recipientId) {
    return res.status(400).json({
      message: "Conversation ID, content, and recipient are required.",
    });
  }

  try {
    const message = new Message({
      conversation: conversationId,
      sender: senderId,
      recipient: recipientId,
      content,
    });
    await message.save();

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: content,
      lastUpdated: Date.now(),
    });

    res.status(201).json({ message });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




// Fetch messages in a conversation
router.get("/messages/inbox", verifyToken, async (req, res) => {
  const userId = req.user._id;

  try {
    // Fetch messages where the recipient is the current user
    const messages = await Message.find({ recipient: userId })
      .populate({
        path: "sender",
        select: "firstName lastName username", // Populate firstName, lastName, and username fields
      })
      .sort({ createdAt: -1 });

    console.log("Fetching inbox messages for user ID:", userId);
    console.log("Messages found:", messages);

    // Check if no messages found
    if (!messages.length) {
      console.log("No messages found for user ID:", userId);
      return res.status(404).json({ message: "No messages found" });
    }

    // Return the populated messages
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching inbox messages for user ID:", userId, error);
    res.status(500).json({ error: "Failed to fetch inbox messages" });
  }
});






// fetch conversation
router.get("/messages/:conversationId", verifyToken, async (req, res) => {
  const { conversationId } = req.params;

  if (!ObjectId.isValid(conversationId)) {
    return res.status(400).json({ error: "Invalid conversation ID" });
  }

  try {
    const messages = await Message.find({ conversation: conversationId })
      .populate({
        path: "sender", // Ensure the sender field is populated correctly
        select: "username firstName lastName", // Select specific fields from the sender
      })
      .sort({ createdAt: -1 });

    // Log to verify that we are getting messages and the sender field
    console.log(
      "Messages found for conversation ID",
      conversationId,
      ":",
      messages
    );

    if (!messages.length) {
      return res.status(404).json({ error: "No messages found" });
    }

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
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
