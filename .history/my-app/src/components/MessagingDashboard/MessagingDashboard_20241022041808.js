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
  const [selectedConversationId, setSelectedConversationId] = useState(null); // Track selected conversation ID
  const [newMessage, setNewMessage] = useState(""); // Track new message content
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [inboxMessages, setInboxMessages] = useState([]);
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
      console.log("Fetched available users:", users); // Log the available users
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

  // Fetch inbox messages for the selected conversation
  const fetchInboxMessagesHandler = useCallback(async () => {
    if (!selectedConversationId) {
      setError("Conversation ID not found.");
      return;
    }

    try {
      setLoadingMessages(true);
      console.log(
        "Fetching messages for conversation ID:",
        selectedConversationId
      ); // Log conversation ID

      const messages = await fetchInboxMessages(selectedConversationId); // Fetch messages by conversation ID
      console.log("Fetched messages:", messages); // Log fetched messages

      setInboxMessages(messages || []);
    } catch (error) {
      setError("Failed to load inbox messages.");
      console.error("Error fetching inbox messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  }, [selectedConversationId, fetchInboxMessages]);

  useEffect(() => {
    if (activeTab === "Inbox") {
      fetchInboxMessagesHandler();
    }
  }, [activeTab, fetchInboxMessagesHandler]);

  // Handle message click to open modal and fetch conversation messages
  const handleMessageClick = (message) => {
    console.log(
      "Clicked message with conversation ID:",
      message.conversation._id
    ); // Log clicked message
    setSelectedConversationId(message.conversation._id); // Set the conversation ID
    setIsModalOpen(true);
  };

  // Handle closing modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedConversationId(null); // Clear selected conversation
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
                handleMessageClick={handleMessageClick} // Pass message click handler
              />
            ) : (
              <p>No messages found.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal for message replies */}
      {isModalOpen && selectedConversationId && (
        <MessageModal
          conversationId={selectedConversationId} // Pass conversation ID to modal
          handleCloseModal={handleCloseModal}
          handleReplySend={handleReplyMessage}
        />
      )}
    </motion.div>
  );
};

export default MessagingDashboard;
