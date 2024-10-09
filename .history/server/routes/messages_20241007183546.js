const express = require("express");
const router = express.Router();
const Conversation = require("../model/conversation");
const Message = require("../model/message");
const verifyToken = require("./verifyToken");


// Create a new conversation
router.post("/conversation", verifyToken, async (req, res) => {
  const { participantIds, title } = req.body;

  if (!participantIds || participantIds.length < 2) {
    return res
      .status(400)
      .json({ message: "At least two participants are required." });
  }

  try {
    const conversation = new Conversation({
      participants: participantIds,
      title,
    });
    await conversation.save();
    res.status(201).json(conversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Send a message
router.post("/message", verifyToken, async (req, res) => {
  const { conversationId, content, recipient } = req.body; // Now includes recipient
  const senderId = req.user._id;

  if (!conversationId || !content || !recipient) {
    return res
      .status(400)
      .json({
        message: "Conversation ID, content, and recipient are required.",
      });
  }

  try {
    const message = new Message({
      conversation: conversationId,
      sender: senderId,
      recipient, // Now saving recipient
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




// Get conversations for the logged-in user
router.get("/conversations", verifyToken, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate("participants", "username role")
      .sort({ lastUpdated: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/message/message/:conversationId", verifyToken, async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await Message.find({
      conversation: conversationId,
    }).populate("sender", "username");
    if (!messages) {
      return res
        .status(404)
        .json({ error: "No messages found for this conversation." });
    }
    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages." });
  }
});



// Add a new endpoint to fetch sent messages
router.get("/messages/sentMessages", verifyToken, async (req, res) => {
  try {
    const sentMessages = await Message.find({ sender: req.user._id })
      .populate("recipient", "username firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json(sentMessages);
  } catch (error) {
    console.error("Error fetching sent messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// Get messages in a conversation
router.get(
  "/conversation/:conversationId/messages",
  verifyToken,
  async (req, res) => {
    const { conversationId } = req.params;

    try {
      const messages = await Message.find({ conversation: conversationId })
        .populate("sender", "username")
        .sort({ createdAt: -1 });

      res.status(200).json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Delete a message
router.delete("/message/:messageId", verifyToken, async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user._id;

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }

    if (message.sender.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this message." });
    }

    await Message.findByIdAndDelete(messageId);
    res.status(200).json({ message: "Message deleted successfully." });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a message
router.put("/message/:messageId", verifyToken, async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  if (!content) {
    return res.status(400).json({ message: "Message content is required." });
  }

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }

    if (message.sender.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to edit this message." });
    }

    message.content = content;
    await message.save();

    res.status(200).json({ message });
  } catch (error) {
    console.error("Error updating message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
