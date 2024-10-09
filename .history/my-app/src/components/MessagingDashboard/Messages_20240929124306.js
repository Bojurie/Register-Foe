import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext/AuthContext";
import "./Messages.css";

const Messages = ({ conversation }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `/api/conversation/${conversation._id}/messages`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Failed to load messages", error);
      }
    };

    if (conversation) {
      fetchMessages();
    }
  }, [conversation, user]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post(
        "/api/message",
        {
          conversationId: conversation._id,
          content: newMessage,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      setMessages((prev) => [...prev, response.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  return (
    <div className="Messages-Container">
      <h2>Messages</h2>
      <div className="Messages-List">
        {messages.map((message) => (
          <div key={message._id} className="Message-Item">
            <strong>{message.sender.username}:</strong> {message.content}
          </div>
        ))}
      </div>
      <div className="Message-Input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Write a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Messages;
