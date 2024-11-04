import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "./MessageModal.css";

const MessageModal = ({ message, handleCloseModal, handleReplySend }) => {
  const [replyContent, setReplyContent] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    // Focus on the textarea when the modal opens
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Check if the sender is a company or user
  const senderName = message?.sender
    ? `${message.sender.firstName || message.sender.companyName || "Unknown"} ${
        message.sender.lastName || ""
      }`.trim()
    : "Unknown Sender";

  // Check if the recipient is valid
  const recipientName = message?.recipient
    ? `${
        message.recipient.firstName ||
        message.recipient.companyName ||
        "Unknown"
      } ${message.recipient.lastName || ""}`.trim()
    : "Unknown Recipient";

  // Handle sending the reply message
  const handleSubmitReply = () => {
    if (!replyContent.trim()) {
      console.error("Reply content cannot be empty.");
      return;
    }

    if (!message?.conversation?._id) {
      console.error("Conversation ID is required for sending a reply.");
      return;
    }

    // Send the reply with the conversation ID
    handleReplySend(message.conversation._id, replyContent);
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
          ref={textareaRef}
          placeholder="Type your reply here..."
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
        />

        <div className="MessageModal-Actions">
          <button onClick={handleSubmitReply} disabled={!replyContent.trim()}>
            Send Reply
          </button>
          <button onClick={handleCloseModal}>Close</button>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageModal;
