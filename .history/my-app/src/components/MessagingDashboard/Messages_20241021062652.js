import React from "react";
import { motion } from "framer-motion";
import "./Messages.css";

const Messages = ({ messages, handleMessageClick }) => {
  return (
    <div className="Messages">
      {messages.length > 0 ? (
        messages.map((message) => (
          <motion.div
            key={message._id}
            className="MessageItem"
            onClick={() => handleMessageClick(message)} // Handle click event
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p>
              <strong>{message?.sender?.firstName || "Unknown Sender"}:</strong>{" "}
              {message.content}
            </p>
          </motion.div>
        ))
      ) : (
        <p>No messages available.</p>
      )}
    </div>
  );
};

export default Messages;
