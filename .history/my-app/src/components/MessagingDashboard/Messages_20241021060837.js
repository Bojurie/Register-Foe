import React from "react";
import { motion } from "framer-motion";
import "./Messages.css";

// Messages component only receives messages as props and maps them for display
const Messages = ({ messages }) => {
  return (
    <div className="Messages">
      {messages.length > 0 ? ( // Ensure messages is not empty before mapping
        messages.map((message) => (
          <motion.div
            key={message._id}
            className="MessageItem"
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
