import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import "./Messages.css";

const Messages = ({ messages, loadingMessages }) => {
  return (
    <div>
      {loadingMessages ? (
        <p>Loading messages...</p>
      ) : messages.length > 0 ? (
        messages.map((message) => (
          <motion.div
            key={message._id}
            className="message-item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
            <strong>
              {message.sender.firstName} {message.sender.lastName}:
            </strong>{" "}
            {message.content}
          </motion.div>
        ))
      ) : (
        <p>No messages available.</p>
      )}
    </div>
  );
};

export default Messages;
