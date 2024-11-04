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
  const { conversationId, content, recipientId } = req.body;
  const senderId = req.user._id;

  if (!conversationId || !content || !recipientId) {
    return res.status(400).json({
      message: "Conversation ID, content, and recipient are required.",
    });
  }
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const conversation = await Conversation.findById(conversationId).session(
      session
    );
    if (!conversation) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Conversation not found." });
    }

    const recipient = await User.findById(recipientId).session(session);
    if (!recipient) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Recipient not found." });
    }

    const message = new Message({
      conversation: conversationId,
      sender: senderId,
      recipient: recipientId,
      content,
    });

    await message.save({ session });

    await Conversation.findByIdAndUpdate(
      conversationId,
      {
        lastMessage: content,
        lastUpdated: Date.now(),
      },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});





router.get("/messages/inbox", verifyToken, async (req, res) => {
  const userId = req.user._id;

  try {
    const messages = await Message.find({ recipient: userId })
      .populate({
        path: "sender",
        select: "firstName lastName username companyName isCompany",
        populate: {
          path: "company", // Assuming there's a company reference in your sender model
          select: "companyName", // Populate company name if it's a company
        },
      })
      .sort({ createdAt: -1 });

    if (!messages.length) {
      return res.status(404).json({ message: "No messages found" });
    }

    const formattedMessages = messages.map((message) => {
      const sender = message.sender;
      return {
        ...message.toObject(),
        sender: sender?.isCompany
          ? {
              companyName: sender.company?.companyName || "Unknown Company",
              username: sender.username,
            }
          : {
              firstName: sender.firstName || "Unknown",
              lastName: sender.lastName || "Sender",
              username: sender.username || "unknown",
            },
      };
    });

    res.status(200).json(formattedMessages);
  } catch (error) {
    console.error("Error fetching inbox messages:", error);
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
