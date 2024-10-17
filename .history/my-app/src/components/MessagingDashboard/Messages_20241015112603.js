import React, { useCallback, useState, useEffect } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import "./Messages.css";
import { motion } from "framer-motion";

const Messages = ({ conversation }) => {
  const { fetchInboxMessages, handleSendMessage, userId } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState(null);

  const fetchAllMessages = useCallback(async () => {
    if (!conversation?._id) {
      setError("Conversation not found.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetchInboxMessages(conversation._id);
      setMessages(response);
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

    if (!conversation?._id) {
      setError("Conversation not found.");
      return;
    }

    const recipientId = conversation.participants.find((p) => p !== userId);
    if (!recipientId) {
      setError("Recipient not found.");
      return;
    }

    try {
      const response = await handleSendMessage(
        conversation._id,
        recipientId,
        newMessage
      );
      setMessages((prevMessages) => [response.message, ...prevMessages]);
      setNewMessage("");
      setError(null);
    } catch (error) {
      setError("Failed to send message.");
      console.error("Failed to send message:", error);
    }
  };

const renderSender = (message) => {
  const sender = message.sender;
  if (sender && sender.firstName && sender.lastName) {
    return `${sender.firstName} ${sender.lastName}`;
  }
  return "Unknown Sender"; 
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
              <strong>{renderSender(message)}:</strong> {message.content}
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
