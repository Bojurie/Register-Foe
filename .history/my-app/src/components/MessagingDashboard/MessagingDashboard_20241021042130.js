import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../AuthContext/AuthContext";
import axiosInstance from "../axiosInstance"; // Assuming axiosInstance is set up for API calls
import "./MessagingDashboard.css";
import { toast } from "react-toastify";
import Conversations from "./Conversations";

const MessagingDashboard = () => {
  const {
    user,
    fetchAdminUsers,
    fetchUserByCompanyCode,
    handleSendMessage,
    fetchInboxMessages,
  } = useAuth();

  const [activeTab, setActiveTab] = useState("New");
  const [availableUsers, setAvailableUsers] = useState([]); // For rendering users in "New" tab
  const [selectedUser, setSelectedUser] = useState(null); // Selected user for new conversation
  const [newMessage, setNewMessage] = useState(""); // Message input for new conversation
  const [loadingMessages, setLoadingMessages] = useState(false); // Loading state for messages
  const [isDashboardVisible, setIsDashboardVisible] = useState(true); // Toggle visibility
  const [showMessageInput, setShowMessageInput] = useState(false); // Control message input display
  const [inboxMessages, setInboxMessages] = useState([]); // Inbox messages
  const [error, setError] = useState(null); // Error state

  // Fetch available users based on role
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

  // Fetch users on component mount
  useEffect(() => {
    if (user) {
      fetchAvailableUsers();
    }
  }, [user, fetchAvailableUsers]);

  // Fetch inbox messages when switching to "Inbox" tab
  const fetchInboxMessagesHandler = useCallback(async () => {
    try {
      setLoadingMessages(true);
      console.log("Fetching inbox messages for user:", user._id); // Log before fetching
      const messages = await fetchInboxMessages();
      setInboxMessages(messages);
      console.log("Fetched inbox messages:", messages); // Log the received messages
    } catch (error) {
      setError("Failed to load inbox messages.");
      console.error("Error fetching inbox messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  }, [user, fetchInboxMessages]);

  // Fetch inbox messages when the "Inbox" tab is clicked
  useEffect(() => {
    if (activeTab === "Inbox") {
      fetchInboxMessagesHandler();
    }
  }, [activeTab, fetchInboxMessagesHandler]);

  // Handle sending a message to the selected user in the "New" tab
  const handleNewMessageSend = async () => {
    if (!selectedUser || !newMessage.trim()) {
      toast.error("A user and message content are required.");
      return;
    }

    try {
      console.log("Sending message to:", selectedUser._id); // Log selected user
      await handleSendMessage(selectedUser._id, newMessage); // Send to the selected user
      setNewMessage(""); // Clear input
      toast.success(`Message sent to ${selectedUser.username}!`);
      console.log("Message sent successfully."); // Log success
    } catch (error) {
      toast.error("Failed to send the message.");
      console.error("Error sending message:", error);
    }
  };

  // Handle selecting a user to start a conversation
  const handleUserSelect = (user) => {
    setSelectedUser(user); // Set the selected user
    setShowMessageInput(true); // Show the message input field
  };

  return (
    <motion.div className="MessagingDashboard-Container">
      <div className="MessagingDashboard-Header">
        <h2 onClick={() => setIsDashboardVisible((prev) => !prev)}>
          {isDashboardVisible ? "Hide" : "Show"} Messaging Dashboard
        </h2>
      </div>

      <AnimatePresence>
        {isDashboardVisible && (
          <motion.div className="MessagingDashboard-Content">
            <div className="MessagingDashboard-Tabs">
              <button
                className={`MessagingTab ${
                  activeTab === "New" ? "active" : ""
                }`}
                onClick={() => setActiveTab("New")}
              >
                New
              </button>
              <button
                className={`MessagingTab ${
                  activeTab === "Inbox" ? "active" : ""
                }`}
                onClick={() => setActiveTab("Inbox")}
              >
                Inbox
              </button>
              <button
                className={`MessagingTab ${
                  activeTab === "Outbox" ? "active" : ""
                }`}
                onClick={() => setActiveTab("Outbox")}
              >
                Outbox
              </button>
            </div>

            {/* New Messages Tab */}
            {activeTab === "New" && (
              <motion.div className="NewMessageContainer">
                <h3>Available Users</h3>
                {availableUsers.length > 0 ? (
                  availableUsers.map((user) => (
                    <motion.div
                      key={user._id}
                      className="UserItem"
                      onClick={() => handleUserSelect(user)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <p>{`${user.firstName} ${user.lastName} (${user.username})`}</p>
                    </motion.div>
                  ))
                ) : (
                  <p>No users available for messaging.</p>
                )}

                {/* Show message input when a user is selected */}
                {showMessageInput && selectedUser && (
                  <div className="MessageInput">
                    <p>
                      Sending message to:{" "}
                      <strong>{selectedUser.username}</strong>
                    </p>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={`Message ${selectedUser.username}`}
                    />
                    <button
                      onClick={handleNewMessageSend}
                      disabled={!newMessage.trim()}
                    >
                      Send
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Inbox Tab */}
            {activeTab === "Inbox" && (
              <motion.div className="InboxMessagesContainer">
                <h3>Inbox Messages</h3>
                {loadingMessages ? (
                  <p>Loading messages...</p>
                ) : inboxMessages.length > 0 ? (
                  inboxMessages.map((message) => (
                    <div key={message._id} className="InboxMessageItem">
                      <p>
                        From: {message.sender.firstName}{" "}
                        {message.sender.lastName} ({message.sender.username})
                      </p>
                      <p>{message.content}</p>
                    </div>
                  ))
                ) : (
                  <p>No messages found.</p>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MessagingDashboard;
