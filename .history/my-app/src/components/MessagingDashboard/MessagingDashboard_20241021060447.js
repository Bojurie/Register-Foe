import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../AuthContext/AuthContext";
import { toast } from "react-toastify";
import Messages from "./Messages"; // Import the Messages component
import "./MessagingDashboard.css";

const MessagingDashboard = () => {
  const {
    user, // Get user from AuthContext
    fetchAdminUsers, // Fetch admins if user is a company or admin
    fetchUserByCompanyCode, // Fetch users in the same company
    fetchInboxMessages, // Function to fetch inbox messages
    handleSendMessage, // Import this correctly from the AuthContext
  } = useAuth();

  const [activeTab, setActiveTab] = useState("Inbox"); // Set default tab to "Inbox"
  const [availableUsers, setAvailableUsers] = useState([]); // List of available users for new messages
  const [selectedUser, setSelectedUser] = useState(null); // Currently selected user for sending a message
  const [newMessage, setNewMessage] = useState(""); // New message content
  const [loadingMessages, setLoadingMessages] = useState(false); // Loading state for inbox messages
  const [inboxMessages, setInboxMessages] = useState([]); // Inbox messages fetched from the server
  const [error, setError] = useState(null); // Error state for fetching or sending messages

  // Fetch available users for the "New" tab
  const fetchAvailableUsers = useCallback(async () => {
    try {
      const users =
        user?.role === "Admin" || user?.isCompany
          ? await fetchUserByCompanyCode(user.companyCode)
          : await fetchAdminUsers(user.companyCode);

      setAvailableUsers(users || []); // Ensure availableUsers is always an array
    } catch (error) {
      console.error("Error fetching available users:", error);
      toast.error("Failed to fetch available users.");
    }
  }, [user, fetchAdminUsers, fetchUserByCompanyCode]);

  // Fetch available users when the component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchAvailableUsers();
    }
  }, [user, fetchAvailableUsers]);

  // Fetch inbox messages when the "Inbox" tab is active
  const fetchInboxMessagesHandler = useCallback(async () => {
    if (!user?._id) {
      setError("User not found.");
      setLoadingMessages(false);
      return;
    }

    try {
      setLoadingMessages(true);
      console.log("Fetching inbox messages for user:", user._id);
      const messages = await fetchInboxMessages(user._id); // Fetch messages from AuthContext
      setInboxMessages(messages || []); // Ensure inboxMessages is always an array
      console.log("Fetched inbox messages:", messages);
    } catch (error) {
      setError("Failed to load inbox messages.");
      console.error("Error fetching inbox messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  }, [user, fetchInboxMessages]);

  // Automatically fetch inbox messages when the "Inbox" tab is active
  useEffect(() => {
    if (activeTab === "Inbox") {
      fetchInboxMessagesHandler();
    }
  }, [activeTab, fetchInboxMessagesHandler]);

  // Handle selecting a user to start a new conversation
  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  // Handle sending a new message
  const handleNewMessageSend = async () => {
    if (!selectedUser || !newMessage.trim()) {
      toast.error("A user and message content are required.");
      return;
    }

    try {
      await handleSendMessage(selectedUser._id, newMessage);
      setNewMessage(""); // Clear input after sending message
      toast.success(`Message sent to ${selectedUser.username}!`);
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
              <Messages messages={inboxMessages} />
            ) : (
              <p>No messages found.</p>
            )}
          </motion.div>
        )}

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

            {selectedUser && (
              <div className="MessageInput">
                <p>
                  Sending message to: <strong>{selectedUser.username}</strong>
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
      </AnimatePresence>
    </motion.div>
  );
};

export default MessagingDashboard;
