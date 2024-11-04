import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../AuthContext/AuthContext";
import { toast } from "react-toastify";
import "./MessagingDashboard.css";

const MessagingDashboard = () => {
  const {
    user,
    fetchAdminUsers,
    fetchUserByCompanyCode,
    handleSendMessage,
    fetchInboxMessages,
  } = useAuth();

  const [activeTab, setActiveTab] = useState("New"); // Tabs: New, Inbox
  const [availableUsers, setAvailableUsers] = useState([]); // Users for messaging
  const [selectedUser, setSelectedUser] = useState(null); // Selected user for messaging
  const [newMessage, setNewMessage] = useState(""); // Message input
  const [loadingMessages, setLoadingMessages] = useState(false); // Loading state for messages
  const [isDashboardVisible, setIsDashboardVisible] = useState(true); // Dashboard visibility toggle
  const [showMessageInput, setShowMessageInput] = useState(false); // Show message input on user selection
  const [inboxMessages, setInboxMessages] = useState([]); // Messages fetched for Inbox tab
  const [error, setError] = useState(null); // Error handling

  // Fetch available users based on the current user's role
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

  // Fetch inbox messages for the logged-in user
  const fetchInboxMessagesHandler = useCallback(async () => {
    if (!user?._id) {
      setError("User not found.");
      setLoadingMessages(false);
      return;
    }

    try {
      setLoadingMessages(true);
      const messages = await fetchInboxMessages(user._id);
      if (messages && messages.length > 0) {
        setInboxMessages(messages);
      } else {
        setError("No messages found for this user.");
      }
    } catch (error) {
      setError("Failed to load inbox messages.");
      console.error("Error fetching inbox messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  }, [user, fetchInboxMessages]);

  // Fetch inbox messages when the "Inbox" tab is active
  useEffect(() => {
    if (activeTab === "Inbox") {
      fetchInboxMessagesHandler();
    }
  }, [activeTab, fetchInboxMessagesHandler]);

  // Handle message sending to a selected user
  const handleNewMessageSend = async () => {
    if (!selectedUser || !newMessage.trim()) {
      toast.error("Please select a user and enter a message.");
      return;
    }

    try {
      await handleSendMessage(selectedUser._id, newMessage);
      setNewMessage(""); // Clear message input
      toast.success(`Message sent to ${selectedUser.username}!`);
    } catch (error) {
      toast.error("Failed to send the message.");
      console.error("Error sending message:", error);
    }
  };

  // Handle selecting a user for messaging
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setShowMessageInput(true);
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
            {/* Tabs: New Message, Inbox */}
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
            </div>

            {/* New Message Tab */}
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

            {/* Inbox Messages Tab */}
            {activeTab === "Inbox" && (
              <motion.div className="InboxMessagesContainer">
                <h3>Inbox Messages</h3>
                {loadingMessages ? (
                  <p>Loading messages...</p>
                ) : inboxMessages.length > 0 ? (
                  inboxMessages.map((message) => (
                    <div key={message._id} className="InboxMessageItem">
                      <p>
                        From: {message.sender?.firstName || "Unknown"}{" "}
                        {message.sender?.lastName || "Sender"} (
                        {message.sender?.username || "Unknown Sender"})
                      </p>
                      <p>{message.content}</p>
                    </div>
                  ))
                ) : (
                  <p>{error || "No messages found."}</p>
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
