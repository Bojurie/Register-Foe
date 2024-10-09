const express = require("express");
const router = express.Router();
const Conversation = require("../model/conversation");
const Message = require("../model/message");
const verifyToken = require("./verifyToken");


// Send a message
// Send a message
router.post("/messages/send", verifyToken, async (req, res) => {
  const { conversationId, content } = req.body;
  const senderId = req.user._id;

  // Validate required fields
  if (!conversationId || !content) {
    return res.status(400).json({
      message: "Conversation ID and content are required.",
    });
  }

  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found." });
    }

    const recipientId = conversation.participants.find(
      (participant) => participant.toString() !== senderId.toString()
    );

    if (!recipientId) {
      return res.status(400).json({ message: "Recipient not found." });
    }

    const message = new Message({
      conversation: conversationId,
      sender: senderId,
      recipient: recipientId,
      content,
    });

    await message.save();

    conversation.lastMessage = content;
    conversation.lastUpdated = Date.now();
    await conversation.save();

    res.status(201).json({ message });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




// Fetch messages in a conversation
router.get("/messages/:conversationId", verifyToken, async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await Message.find({ conversation: conversationId })
      .populate("sender", "username firstName lastName")
      .sort({ createdAt: 1 }); 

    if (!messages.length) {
      return res.status(404).json({ message: "No messages found." });
    }

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



module.exports = router;
