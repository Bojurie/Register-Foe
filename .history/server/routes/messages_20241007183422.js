import React, { useCallback, useState, useEffect } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import "./Messages.css";
import { motion } from "framer-motion";

const Messages = ({ conversation }) => {
  const { fetchInboxMessages, handleSendMessage, userId } = useAuth(); // Retrieve userId from AuthContext
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState(null); // Store error message

  // Fetch messages for the current conversation
  const fetchAllMessages = useCallback(async () => {
    try {
      if (!conversation?._id) {
        console.warn("fetchMessages: Conversation ID is undefined or null");
        return;
      }
      const response = await fetchInboxMessages(conversation._id);
      setMessages(response);
    } catch (error) {
      console.error("Error in fetchMessages:", error);
    } finally {
      setLoading(false);
    }
  }, [conversation, fetchInboxMessages]);

  useEffect(() => {
    if (conversation) {
      fetchAllMessages();
    }
  }, [conversation, fetchAllMessages]);

  // Handle sending a new message
  const handleMessageSend = async () => {
    if (!newMessage.trim()) {
      setError("Message content cannot be empty.");
      return;
    }

    if (!conversation?._id) {
      setError("Conversation ID is required but not provided.");
      return;
    }

    // Find recipient ID (the other participant in the conversation)
    const recipientId = conversation.participants.find((p) => p !== userId);

    if (!recipientId) {
      setError("Recipient ID is missing.");
      return;
    }

    // Prepare message data
    const messageData = {
      conversationId: conversation._id,
      content: newMessage,
      recipient: recipientId,
    };

    try {
      const response = await handleSendMessage(messageData); // Send message
      console.log("Message sent successfully:", response.message);
      setMessages((prevMessages) => [response.message, ...prevMessages]);
      setNewMessage(""); // Clear input after sending
      setError(null); // Clear error on success
    } catch (error) {
      console.error("Failed to send message:", error);
      setError("Failed to send message. Please try again.");
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
              <strong>{message.sender.username}:</strong> {message.content}
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
