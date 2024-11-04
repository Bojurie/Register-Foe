import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../AuthContext/AuthContext"; // Import user context for sender information
import "./MessageModal.css";

const MessageModal = ({ message, handleCloseModal, handleReplySend }) => {
  const { user } = useAuth(); // Get user from AuthContext
  const [replyContent, setReplyContent] = useState(""); // Initialize replyContent

  const handleSubmitReply = () => {
    if (!replyContent.trim()) {
      console.error("Reply content cannot be empty");
      return;
    }

    // Ensure the reply message includes the conversation ID, current user (as sender), and reply content
    handleReplySend(message.conversation, user._id, replyContent);
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
