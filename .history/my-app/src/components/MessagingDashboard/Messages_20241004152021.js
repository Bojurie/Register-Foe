import React, { useCallback, useState, useEffect } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import "./Messages.css";
import { motion } from "framer-motion";

const Messages = ({ conversation }) => {
  const { fetchInboxMessages, handleSendMessage } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");

  // Fetch messages for the current conversation
  const fetchAllMessages = useCallback(async () => {
    try {
      if (!conversation._id) {
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
    if (!newMessage.trim()) return;

    if (!conversation?._id) {
      console.error("Conversation ID is required but not provided.");
      return;
    }

    try {
      const response = await handleSendMessage({
        conversationId: conversation._id,
        content: newMessage,
      });
      console.log("Message sent successfully:", response.message);
      setMessages((prevMessages) => [response.message, ...prevMessages]);
      setNewMessage("");
    } catch (error) {
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
              <strong>{message.sender.username}:</strong> {message.content}
            </p>
          </motion.div>
        ))
      ) : (
        <p>No messages available.</p>
      )}
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
