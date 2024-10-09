import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import "./Conversation.css";
import { getMessages, sendMessage } from "../api/messagesApi";

const Conversation = ({ conversation }) => {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all messages when the component is mounted or when conversation changes
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
  }, [conversation]);

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !user?.token) return;

    try {
      const response = await sendMessage({
        conversationId: conversation._id,
        content: newMessage,
        token: user.token,
      });
      setMessages((prevMessages) => [response.message, ...prevMessages]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }, [newMessage, user, conversation]);

  return (
    <div className="Conversation">
      <h3>Conversation: {conversation?.title || "No Title"}</h3>

      <div className="MessagesContainer">
        {loading ? (
          <p>Loading messages...</p>
        ) : messages.length > 0 ? (
          messages.map((message) => (
            <div key={message._id} className="Message">
              <strong>{message.sender.username}</strong>: {message.content}
            </div>
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
        <button onClick={handleSendMessage} disabled={!newMessage.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Conversation;
