import React, { useState, useCallback } from "react";
import { sendMessage } from "../api/messagesApi";
import { useAuth } from "../AuthContext/AuthContext";
import "./Conversation.css";

const Conversation = ({ conversation }) => {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !user?.token) return;

    try {
      await sendMessage(conversation._id, newMessage, user.token);
      setNewMessage(""); // Clear the message input after sending
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }, [newMessage, user, conversation]);

  return (
    <div className="Conversation">
      <h3>Conversation: {conversation.title}</h3>
      <div className="MessageInput">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Conversation;
