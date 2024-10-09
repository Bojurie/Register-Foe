import React, { useCallback, useState, useEffect } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import "./Messages.css";
import { motion } from "framer-motion";

const Messages = ({ conversation }) => {
  const { fetchInboxMessages, handleSendMessage } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState(null);

  // Fetch messages for the current conversation
  const fetchAllMessages = useCallback(async () => {
    try {
      if (!conversation?._id) {
        console.warn("fetchMessages: Conversation ID is undefined or null");
        return;
      }
      const response = await fetchInboxMessages(conversation._id);
      setMessages(response || []);
    } catch (err) {
      console.error("Error in fetchMessages:", err);
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

  try {
    const recipientId = conversation.participants.find((p) => p !== yourUserId); // Assuming 'yourUserId' is the logged-in user
    const messageData = {
      conversationId: conversation._id,
      content: newMessage,
      recipient: recipientId,
    };

    const response = await handleSendMessage(messageData);
    console.log("Message sent successfully:", response.message);
    setMessages((prevMessages) => [response.message, ...prevMessages]);
    setNewMessage("");
  } catch (error) {
    console.error("Failed to send message:", error);
    setError("Failed to send message.");
  }
};


  return (
    <div className="Messages">
      {loading ? (
        <div className="LoadingIndicator">Loading messages...</div>
      ) : error ? (
        <p className="ErrorMessage">{error}</p>
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
              <strong>{message.sender?.username || "Unknown"}:</strong>{" "}
              {message.content}
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
