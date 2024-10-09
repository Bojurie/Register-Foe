import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import "./Conversation.css";
import { motion } from "framer-motion";

const Conversation = ({ conversation }) => {
  const { user, getMessages, sendMessage } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await getMessages(conversation._id);
        setMessages(response);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoading(false);
      }
    };

    if (conversation?._id) {
      fetchMessages();
    }
  }, [conversation, getMessages]);

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !user?.token) return;

    try {
      const response = await sendMessage({
        conversationId: conversation._id,
        content: newMessage,
        token: user.token,
      });
      setMessages((prevMessages) => [...prevMessages, response.message]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }, [newMessage, user, conversation, sendMessage]);

  return (
    <div className="Conversation">
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Conversation: {conversation?.title || "No Title"}
      </motion.h3>

      <div className="MessagesContainer">
        {loading ? (
          <p>Loading messages...</p>
        ) : messages.length > 0 ? (
          messages.map((message) => (
            <motion.div
              key={message._id}
              className="Message"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <strong>{message.sender.username}</strong>: {message.content}
            </motion.div>
          ))
        ) : (
          <p>No messages in this conversation.</p>
        )}
      </div>

      <div className="MessageInput">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          className="SendButton"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Conversation;
