const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Conversation = require("../model/conversation");
const Message = require("../model/message");
const verifyToken = require("./verifyToken");
const User = require("../model/User");
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
  const { content, recipientId } = req.body;
  const senderId = req.user._id;

  if (!content || !recipientId) {
    return res
      .status(400)
      .json({ message: "Content and recipient ID are required." });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const conversation = new Conversation({
      participants: [senderId, recipientId],
      lastMessage: content,
    });
    await conversation.save({ session });

    const message = new Message({
      conversation: conversation._id,
      sender: senderId,
      recipient: recipientId,
      content,
    });

    await message.save({ session });

    conversation.lastMessage = content;
    conversation.lastUpdated = Date.now();
    await conversation.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({ conversationId: conversation._id, message });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error sending message:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});




// POST: Reply to a Message
router.post("/messages/reply", verifyToken, async (req, res) => {
  const { conversationId, content } = req.body;
  const userId = req.user._id;

  if (!conversationId || !content) {
    return res.status(400).json({ error: "Conversation ID and content are required." });
  }

  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found." });
    }

    const newMessage = new Message({
      conversation: conversationId,
      sender: userId,
      content,
      createdAt: new Date(),
    });

    const savedMessage = await newMessage.save();

    conversation.lastMessage = content;
    conversation.lastUpdated = new Date();
    await conversation.save();

    return res.status(201).json({ message: "Reply sent successfully", data: savedMessage });
  } catch (error) {
    console.error("Error sending reply:", error);
    return res.status(500).json({ error: "Failed to send reply" });
  }
});






// fetch conversation
router.get("/messages/:conversationId", verifyToken, async (req, res) => {
  const { conversationId } = req.params;

  // Log the received conversationId
  console.log("Received conversation ID:", conversationId);

  // Check if the conversationId is a valid MongoDB ObjectId
  if (!ObjectId.isValid(conversationId)) {
    console.error("Invalid conversation ID:", conversationId); // Log invalid ID case
    return res.status(400).json({ error: "Invalid conversation ID" });
  }

  try {
    const messages = await Message.find({ conversation: conversationId })
      .populate({
        path: "sender",
        select: "firstName lastName username isCompany companyName",
        populate: {
          path: "company",
          select: "companyName",
        },
      })
      .sort({ createdAt: -1 });

    // If no messages are found, log and return a 404 response
    if (!messages.length) {
      console.log("No messages found for conversation ID:", conversationId);
      return res.status(404).json({ error: "No messages found" });
    }

    // Log the successfully fetched messages
    console.log(
      "Fetched messages for conversation ID:",
      conversationId,
      messages
    );

    return res.status(200).json(messages);
  } catch (error) {
    console.error(
      "Error fetching messages for conversation ID:",
      conversationId,
      error
    );
    return res.status(500).json({ error: "Failed to fetch messages" });
  }
});









router.get("/messages/:userId", verifyToken, async (req, res) => {
  const userId = req.params.userId;

  try {
    const messages = await Message.find({ recipient: userId })
      .populate({
        path: "sender",
        select: "firstName lastName username companyName isCompany",
        populate: {
          path: "company",
          select: "companyName",
        },
      })
      .sort({ createdAt: -1 });

    if (!messages.length) {
      return res.status(404).json({ message: "No messages found" });
    }

    const formattedMessages = messages.map((message) => {
      const sender = message.sender;

      const senderName = sender?.isCompany
        ? sender?.company?.companyName || "Unknown Company"
        : `${sender?.firstName || "Unknown"} ${sender?.lastName || "Sender"}`;

      return {
        ...message.toObject(),
        senderName, 
      };
    });

    res.status(200).json(formattedMessages);
  } catch (error) {
    console.error("Error fetching inbox messages:", error);
    res.status(500).json({ error: "Failed to fetch inbox messages" });
  }
});



// PUT /messages/reply/:messageId

router.put('/messages/reply/:conversationId', verifyToken, async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  if (!content) {
    return res.status(400).json({ error: 'Content is required to update a reply' });
  }

  try {
    // Find the message by ID and verify the sender
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.sender.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'You are not authorized to update this message' });
    }

    // Update the message content
    message.content = content;
    message.updatedAt = new Date();
    const updatedMessage = await message.save();

    return res.status(200).json({
      message: 'Reply updated successfully',
      data: updatedMessage,
    });
  } catch (error) {
    console.error('Error updating reply:', error);
    return res.status(500).json({ error: 'Failed to update reply' });
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
