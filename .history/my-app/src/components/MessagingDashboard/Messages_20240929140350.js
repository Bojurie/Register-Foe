import React, { useCallback, useState, useEffect } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import "./Messages.css";
import { motion } from "framer-motion";

const Messages = ({ conversation }) => {
  const { getMessages } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    try {
      if (!conversation._id) {
        console.warn("fetchMessages: Conversation ID is undefined or null");
        return;
      }
      const response = await getMessages(conversation._id);
      setMessages(response);
    } catch (error) {
      console.error("Error in fetchMessages:", error);
    } finally {
      setLoading(false);
    }
  }, [conversation, getMessages]);

  useEffect(() => {
    if (conversation) {
      fetchMessages();
    }
  }, [conversation, fetchMessages]);

  if (loading) {
    return <div className="LoadingIndicator">Loading messages...</div>;
  }

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
              <strong>{message.sender.username}:</strong> {message.content}
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
