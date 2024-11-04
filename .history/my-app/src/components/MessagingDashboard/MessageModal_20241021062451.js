import React, { useState } from "react";
import { motion } from "framer-motion";
import "./MessageModal.css";

const MessageModal = ({ message, handleCloseModal, handleReplySend }) => {
  const [replyMessage, setReplyMessage] = useState("");

  const handleSendReply = () => {
    if (replyMessage.trim()) {
      handleReplySend(message.conversation, replyMessage);
    }
  };

  return (
    <div className="MessageModal">
      <motion.div
        className="ModalContent"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button className="CloseModal" onClick={handleCloseModal}>
          Close
        </button>
        <div className="MessageDetails">
          <h3>From: {message?.sender?.firstName || "Unknown Sender"}</h3>
          <p>{message.content}</p>
        </div>
        <div className="ReplyInput">
          <textarea
            placeholder="Type your reply..."
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
          />
          <button onClick={handleSendReply} disabled={!replyMessage.trim()}>
            Send Reply
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MessageModal;
