import React, { useCallback, useState, useEffect } from "react";
import { useAuth } from "../AuthContext/AuthContext"; // Import AuthContext
import "./Messages.css";
import { motion } from "framer-motion";

const Messages = ({ conversation }) => {
  const { fetchInboxMessages, handleSendMessage, userId } = useAuth(); // Assuming userId is available in AuthContext
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState(null); // Handle errors

  // Fetch messages for the current conversation
  const fetchAllMessages = useCallback(async () => {
    try {
      if (!conversation?._id) {
        console.warn("fetchMessages: Conversation ID is undefined or null");
        setError("Conversation not found.");
        return;
      }
      const response = await fetchInboxMessages(conversation._id);
      setMessages(response);
    } catch (error) {
      console.error("Error in fetchMessages:", error);
      setError("Failed to load messages.");
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
    if (!newMessage.trim()) return;

    if (!conversation?._id) {
      console.error("Conversation ID is required but not provided.");
      setError("Conversation not found.");
      return;
    }

    const recipientId = conversation.participants.find((p) => p !== userId); // Using current user's ID from AuthContext

    if (!recipientId) {
      setError("Recipient not found in the conversation.");
      return;
    }

    // Log conversationId, recipientId, and content (newMessage)
    console.log("Sending message with the following details:");
    console.log("conversationId:", conversation._id);
    console.log("recipientId:", recipientId);
    console.log("content:", newMessage);

    try {
      const messageData = {
        conversationId: conversation._id,
        content: newMessage,
        recipientId, // Ensure recipientId is passed correctly
      };

      const response = await handleSendMessage(
        conversation._id,
        recipientId,
        newMessage
      );
      console.log("Message sent successfully:", response.message);
      setMessages((prevMessages) => [response.message, ...prevMessages]);
      setNewMessage("");
      setError(null); // Clear errors on success
    } catch (error) {
      console.error("Failed to send message:", error);
      setError("Failed to send message.");
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
