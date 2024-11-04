import React, { useState } from "react";
import { motion } from "framer-motion";
import "./Messages.css";

const Messages = ({ messages, conversation }) => {
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState(null);

  const handleMessageSend = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await handleSendMessage(conversation._id, newMessage);
      if (response && response.message) {
        setMessages((prevMessages) => [response.message, ...prevMessages]);
        setNewMessage("");
      } else {
        setError("Failed to send message.");
      }
    } catch (error) {
      setError("Failed to send message.");
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="Messages">
      {messages.length > 0 ? (
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
      {error && <p className="error-message">{error}</p>}

      <div className="MessageInput">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleMessageSend} disabled={!newMessage.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Messages;
