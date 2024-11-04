import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../AuthContext/AuthContext";
import { toast } from "react-toastify";
import Messages from "./Messages"; // Import the Messages component
import MessageModal from "./MessageModal"; // Import the modal component
import "./MessagingDashboard.css";

const MessagingDashboard = () => {
  const {
    user,
    fetchAdminUsers,
    fetchUserByCompanyCode,
    fetchInboxMessages,
    handleSendMessage,
    handleReplyMessage, // Function to handle replies
  } = useAuth();

  const [activeTab, setActiveTab] = useState("Inbox");
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null); // Track selected message for modal
  const [replyContent, setReplyContent] = useState(""); // Reply content in modal
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [inboxMessages, setInboxMessages] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  // Fetch available users (for "New" tab)
  const fetchAvailableUsers = useCallback(async () => {
    try {
      const users =
        user?.role === "Admin" || user?.isCompany
          ? await fetchUserByCompanyCode(user.companyCode)
          : await fetchAdminUsers(user.companyCode);

      setAvailableUsers(users || []);
    } catch (error) {
      console.error("Error fetching available users:", error);
      toast.error("Failed to fetch available users.");
    }
  }, [user, fetchAdminUsers, fetchUserByCompanyCode]);

  useEffect(() => {
    if (user) {
      fetchAvailableUsers();
    }
  }, [user, fetchAvailableUsers]);

  // Fetch inbox messages
  const fetchInboxMessagesHandler = useCallback(async () => {
    if (!user?._id) {
      setError("User not found.");
      setLoadingMessages(false);
      return;
    }

    try {
      setLoadingMessages(true);
      const messages = await fetchInboxMessages(user._id);
      setInboxMessages(messages || []);
    } catch (error) {
      setError("Failed to load inbox messages.");
      console.error("Error fetching inbox messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  }, [user, fetchInboxMessages]);

  useEffect(() => {
    if (activeTab === "Inbox") {
      fetchInboxMessagesHandler();
    }
  }, [activeTab, fetchInboxMessagesHandler]);

  // Handle clicking a message to open the modal
  const handleMessageClick = (message) => {
    setSelectedMessage(message); // Set the selected message
    setIsModalOpen(true); // Open the modal
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null); // Clear selected message
    setReplyContent(""); // Clear reply content
  };

  // Handle sending a reply
  const handleReplySend = async () => {
    if (!replyContent.trim()) {
      toast.error("Reply content is required.");
      return;
    }

    try {
      const conversationId = selectedMessage.conversation;
      const recipientId = selectedMessage.recipient;

      await handleReplyMessage(conversationId, recipientId, replyContent);
      toast.success("Reply sent successfully!");
      handleCloseModal(); // Close the modal after sending
    } catch (error) {
      toast.error("Failed to send the reply.");
      console.error("Error sending reply:", error);
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
                handleMessageClick={handleMessageClick} // Pass click handler for opening the modal
              />
            ) : (
              <p>No messages found.</p>
            )}
          </motion.div>
        )}

        {/* New message logic can go here */}
      </AnimatePresence>

      {/* Message Modal */}
      {isModalOpen && selectedMessage && (
        <MessageModal
          message={selectedMessage}
          handleCloseModal={handleCloseModal}
          handleReplySend={handleReplySend}
          replyContent={replyContent}
          setReplyContent={setReplyContent} // Bind reply content to state
        />
      )}
    </motion.div>
  );
};

export default MessagingDashboard;
