import React, { useCallback, useState, useEffect } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import { motion } from "framer-motion";
import "./Messages.css";

const Messages = ({ conversation }) => {
  const { fetchInboxMessages, handleSendMessage, userId } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllMessages = useCallback(async () => {
    if (!conversation?._id) {
      setError("Conversation not found.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetchInboxMessages(conversation._id);
      if (response && response.length > 0) {
        setMessages(response);
      } else {
        setError("No messages found for this conversation.");
      }
    } catch (error) {
      setError("Failed to load messages.");
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }, [conversation, fetchInboxMessages]);

  useEffect(() => {
    if (conversation) {
      fetchAllMessages();
    }
  }, [conversation, fetchAllMessages]);

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
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="Messages">
      {loading ? (
        <div className="LoadingIndicator">Loading messages...</div>
      ) : messages.length > 0 ? (
        messages.map((message) => (
          <motion.div
            key={message._id}
            className="MessageItem"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p>
              <strong>
                {message?.sender?.firstName || "Unknown"}{" "}
                {message?.sender?.lastName || "Sender"}:
              </strong>{" "}
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
