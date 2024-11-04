// MessagingDashboard.js
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../AuthContext/AuthContext";
import { toast } from "react-toastify";
import Messages from "./Messages";
import MessageModal from "./MessageModal";
import Conversations from "./Conversations";
import "./MessagingDashboard.css";

const MessagingDashboard = () => {
  const {
    user,
    fetchAdminUsers,
    fetchUserByCompanyCode,
    handleSendMessage,
    fetchInboxMessages,
    handleReplyMessage,
  } = useAuth();

  const [activeTab, setActiveTab] = useState("Inbox");
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Track selected user/recipient
  const [newMessage, setNewMessage] = useState(""); // Track new message content
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [inboxMessages, setInboxMessages] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null); // Track conversation ID
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch available users (for the "New" tab)
  const fetchAvailableUsers = useCallback(async () => {
    try {
      const users =
        user?.role === "Admin" || user?.isCompany
          ? await fetchUserByCompanyCode(user.companyCode)
          : await fetchAdminUsers(user.companyCode);

      setAvailableUsers(users || []);
    } catch (error) {
      toast.error("Failed to fetch available users.");
      console.error("Error fetching available users:", error);
    }
  }, [user, fetchAdminUsers, fetchUserByCompanyCode]);

  useEffect(() => {
    if (user) {
      fetchAvailableUsers();
    }
  }, [user, fetchAvailableUsers]);

  // Fetch inbox messages based on conversation ID
  const fetchInboxMessagesHandler = useCallback(async () => {
    if (!selectedConversationId) {
      setError("Conversation not found.");
      console.error("Conversation ID is missing.");
      return;
    }

    console.log(
      "Fetching messages for conversation ID:",
      selectedConversationId
    );

    try {
      setLoadingMessages(true);
      const messages = await fetchInboxMessages(selectedConversationId);
      console.log("Fetched messages from server:", messages);

      setInboxMessages(messages || []);
    } catch (error) {
      setError("Failed to load inbox messages.");
      console.error("Error fetching inbox messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  }, [fetchInboxMessages, selectedConversationId]);

  useEffect(() => {
    if (activeTab === "Inbox") {
      fetchInboxMessagesHandler();
    }
  }, [activeTab, fetchInboxMessagesHandler]);

  // Handle message click to open modal and track conversation
  const handleMessageClick = (message) => {
    setSelectedUser(message.recipient || message.sender); // Set the other party in the conversation
    setSelectedConversationId(message.conversation); // Set conversation ID
    setIsModalOpen(true);
  };

  // Handle closing modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setSelectedConversationId(null); // Reset conversation ID
  };

  // Handle sending a new message to a selected user
  const handleSendMessageToUser = async () => {
    if (!selectedUser?._id || !newMessage.trim()) {
      console.error("Recipient and content are required to send a message.");
      toast.error("Recipient and message content are required.");
      return;
    }

    try {
      const messageData = {
        recipientId: selectedUser._id,
        content: newMessage,
      };

      console.log("Message Data being sent:", messageData);
      const response = await handleSendMessage(messageData); // Call the function to send the new message
      console.log("Message sent response:", response);

      toast.success("Message sent to user!");
      setNewMessage(""); // Clear message input after sending
    } catch (error) {
      toast.error("Failed to send the message.");
      console.error("Error sending message:", error);
    }
  };

  return (
    <motion.div className="MessagingDashboard-Container">
      <div className="MessagingDashboard-Header">
        <h2>Messaging Dashboard</h2>
      </div>

      <div className="MessagingDashboard-Tabs">
        <button
          className={`MessagingTab ${activeTab === "Inbox" ? "active" : ""}`}
          onClick={() => setActiveTab("Inbox")}
        >
          Inbox
        </button>
        <button
          className={`MessagingTab ${activeTab === "New" ? "active" : ""}`}
          onClick={() => setActiveTab("New")}
        >
          New
        </button>
      </div>

      <AnimatePresence>
        {activeTab === "Inbox" && (
          <motion.div className="InboxMessagesContainer">
            <h3>Inbox Messages</h3>
            {loadingMessages ? (
              <p>Loading messages...</p>
            ) : inboxMessages.length > 0 ? (
              <Messages
                messages={inboxMessages}
                handleMessageClick={handleMessageClick} // Pass the click handler
              />
            ) : (
              <p>No messages found.</p>
            )}
          </motion.div>
        )}

        {activeTab === "New" && (
          <motion.div className="NewMessageContainer">
            <h3>Select a User to Send a Message</h3>
            <Conversations
              availableUsers={availableUsers}
              onConversationSelect={(user) => setSelectedUser(user)} // Select a user
            />

            {selectedUser && (
              <div className="MessageInput">
                <p>
                  Sending message to: <strong>{selectedUser.username}</strong>
                </p>
                <textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)} // Update message content
                />
                <button onClick={handleSendMessageToUser}>Send Message</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal for replies */}
      {isModalOpen && selectedUser && (
        <MessageModal
          message={selectedUser}
          handleCloseModal={handleCloseModal}
          handleReplySend={handleReplyMessage}
        />
      )}
    </motion.div>
  );
};

export default MessagingDashboard;