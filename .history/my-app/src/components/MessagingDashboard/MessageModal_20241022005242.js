import React, { useState } from "react";
import { motion } from "framer-motion";
import "./MessageModal.css";

const MessageModal = ({ message, handleCloseModal, handleReplySend }) => {
  const [replyContent, setReplyContent] = useState(""); // Initialize replyContent

  const handleSubmitReply = () => {
    if (!replyContent || !replyContent.trim()) {
      console.error("Message content cannot be empty");
      return;
    }

    handleReplySend(message.conversationId, replyContent); // Send the reply
    setReplyContent(""); // Clear the input field after sending
  };

  const senderName = message?.sender
    ? `${message.sender.firstName || "Unknown"} ${
        message.sender.lastName || "Sender"
      }`
    : "Unknown Sender"; // Fallback if message.sender is undefined

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
