import React, { useState } from "react";
import { motion } from "framer-motion";
import "./MessageModal.css";

const MessageModal = ({ message, handleCloseModal, handleReplySend }) => {
  const [replyContent, setReplyContent] = useState(""); // Initialize replyContent

  // Check if the sender is a company or user
  const senderName = message?.sender
    ? `${message.sender.firstName || message.sender.companyName || "Unknown"} ${
        message.sender.lastName || ""
      }`.trim()
    : "Unknown Sender"; // Fallback if message.sender is undefined

  // Check if the recipient is valid
  const recipientName = message?.recipient
    ? `${
        message.recipient.firstName ||
        message.recipient.companyName ||
        "Unknown"
      } ${message.recipient.lastName || ""}`.trim()
    : "Unknown Recipient"; // Fallback if message.recipient is undefined

  const handleSubmitReply = () => {
    if (!replyContent.trim()) {
      console.error("Reply content cannot be empty");
      return;
    }

    handleReplySend(message.conversation._id, replyContent); // Ensure conversationId is passed correctly
    setReplyContent(""); // Clear the input field after sending
  };

  return (
    <motion.div
      className="MessageModal-Container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="MessageModal-Content">
        <h3>Reply to Message</h3>
        <p>
          <strong>From:</strong> {senderName}
        </p>
        <p>
          <strong>To:</strong> {recipientName}
        </p>
        <p>{message?.content || "No content available."}</p>

        <textarea
          placeholder="Type your reply..."
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)} // Update replyContent as the user types
        />

        <div className="MessageModal-Actions">
          <button onClick={handleSubmitReply}>Send Reply</button>
          <button onClick={handleCloseModal}>Close</button>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageModal;
