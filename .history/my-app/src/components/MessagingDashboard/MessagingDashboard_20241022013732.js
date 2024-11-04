import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../AuthContext/AuthContext";
import { toast } from "react-toastify";
import Messages from "./Messages";
import MessageModal from "./MessageModal";
// import Conversations from "./Conversations"; 
import "./MessagingDashboard.css";
import Conversations from "./Conversations";

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
  const [selectedUser, setSelectedUser] = useState(null); // Track selected recipient
  const [newMessage, setNewMessage] = useState(""); // Track new message content
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [inboxMessages, setInboxMessages] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch available users for the "New" tab
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

  // Fetch inbox messages
  const fetchInboxMessagesHandler = useCallback(async () => {
    if (!user?._id) {
      setError("User not found.");
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
    setSelectedUser(message?.recipient || message?.sender); // Make sure we know who the conversation is with
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null); // Clear selected recipient
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
        conversationId: null, // New message without an existing conversation
        recipientId: selectedUser._id, // Use selected user's ID as the recipient
        content: newMessage, // Message content from the input
      };

      await handleSendMessage(messageData);
      toast.success("Message sent to user!");
      setNewMessage(""); // Clear the message input after sending
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
                handleMessageClick={handleMessageClick}
              />
            ) : (
              <p>No messages found.</p>
            )}
          </motion.div>
        )}

        {/* New Message Tab */}
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
                  onChange={(e) => setNewMessage(e.target.value)} // Update the message content
                />
                <button onClick={handleSendMessageToUser}>Send Message</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Modal for Replies */}
      {isModalOpen && selectedUser && (
        <MessageModal
          message={selectedUser} // Use the selected user for reply
          handleCloseModal={handleCloseModal}
          handleReplySend={handleSendMessageToUser} // Reuse the message sending function
        />
      )}
    </motion.div>
  );
};

export default MessagingDashboard;
