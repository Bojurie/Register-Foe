import React, { useCallback, useState, useEffect } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import { motion } from "framer-motion";
import "./Messages.css";
import Modal from "react-modal"; // Import Modal for message details

const Messages = ({ conversation }) => {
  const { fetchInboxMessages, handleSendMessage, handleDeleteMessage, userId } =
    useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null); // For the clicked message
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

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

  // Use effect to load messages when the conversation changes
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
  const handleDelete = async (messageId) => {
    try {
      await handleDeleteMessage(messageId);
      setMessages(messages.filter((msg) => msg._id !== messageId)); // Remove deleted message from state
      setIsModalOpen(false); // Close the modal after deleting
    } catch (error) {
      console.error("Error deleting message:", error);
      setError("Failed to delete message.");
    }
  };

  // Handle clicking on a message to open modal
  const openMessageModal = (message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
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

      {/* Modal for viewing message details and replying */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Message Details"
        className="MessageModal"
        overlayClassName="MessageModalOverlay"
      >
        {selectedMessage && (
          <>
            <h3>Message Details</h3>
            <p>
              <strong>From: {renderSender(selectedMessage)}</strong>
            </p>
            <p>{selectedMessage.content}</p>
            <p>
              <small>
                {new Date(selectedMessage.createdAt).toLocaleString()}
              </small>
            </p>

            {/* Text area for replying */}
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Write your reply..."
              className="ReplyTextArea"
            />

            {/* Reply and Delete buttons */}
            <div className="ModalButtons">
              <button
                className="ReplyButton"
                onClick={handleMessageSend}
                disabled={!newMessage.trim()}
              >
                Reply
              </button>
              <button
                className="DeleteButton"
                onClick={() => handleDelete(selectedMessage._id)}
              >
                Delete
              </button>
              <button className="CloseButton" onClick={closeModal}>
                Close
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Messages;
