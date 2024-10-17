import React, { useCallback, useState, useEffect } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import "./Messages.css";
import { motion } from "framer-motion";

const Messages = ({ conversation }) => {
  const { fetchInboxMessages, handleSendMessage, deleteMessage, userId } =
    useAuth(); // Fetch functions from AuthContext
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all messages for the current conversation
  const fetchAllMessages = useCallback(async () => {
    if (!conversation?._id) {
      setError("Conversation not found.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetchInboxMessages(conversation._id);
      if (response) {
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

  // Handle sending a new message
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

  // Handle deleting a message
  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(messageId); // Assuming deleteMessage is in AuthContext
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message._id !== messageId)
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  // Open modal with message details
  const openMessageModal = (message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  // Close modal
  const closeMessageModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
  };

  // Render the sender's name
  const renderSender = (message) => {
    const sender = message?.sender;
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
            onClick={() => openMessageModal(message)} // Open modal on click
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

      {/* Modal for viewing message details and replying */}
      {isModalOpen && selectedMessage && (
        <div className="MessageModal">
          <div className="MessageModalContent">
            <button className="CloseButton" onClick={closeMessageModal}>
              X
            </button>
            <h3>Message Details</h3>
            <p>
              <strong>From:</strong> {renderSender(selectedMessage)}
            </p>
            <p>
              <strong>Content:</strong> {selectedMessage.content}
            </p>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Reply to this message"
            />
            <div className="ModalButtons">
              <button onClick={handleMessageSend} disabled={!newMessage.trim()}>
                Reply
              </button>
              <button onClick={() => handleDeleteMessage(selectedMessage._id)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
