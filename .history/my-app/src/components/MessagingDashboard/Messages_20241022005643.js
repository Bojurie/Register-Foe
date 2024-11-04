import React, { useState } from "react";
import { motion } from "framer-motion";
import "./MessageModal.css";

const MessageModal = ({ message, handleCloseModal, handleReplySend }) => {
  const [replyContent, setReplyContent] = useState(""); // Initialize replyContent with an empty string

  const handleSubmitReply = () => {
    if (!replyContent || !replyContent.trim()) {
      // Check if the replyContent is empty or undefined
      console.error("Message content cannot be empty");
      return;
    }

    handleReplySend(message.conversationId, replyContent); // Send the reply
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
          <strong>From:</strong> {message.sender?.firstName || "Unknown Sender"}
        </p>
        <p>{message.content}</p>

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
