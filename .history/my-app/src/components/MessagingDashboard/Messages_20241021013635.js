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

    const recipientId = conversation.participants.find((p) => p !== userId);
    if (!recipientId) {
      setError("Recipient not found.");
      return;
    }

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
}

export default Messages;
