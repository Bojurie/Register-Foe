import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../AuthContext/AuthContext";
import { toast } from "react-toastify";
import Messages from "./Messages"; // Import the Messages component
import "./MessagingDashboard.css";

const MessagingDashboard = () => {
  const {
    user,
    fetchAdminUsers,
    fetchUserByCompanyCode,
    handleSendMessage,
    fetchInboxMessages,
  } = useAuth();

  const [activeTab, setActiveTab] = useState("Inbox");
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [inboxMessages, setInboxMessages] = useState([]);
  const [error, setError] = useState(null);

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
      console.log("Fetching inbox messages for user:", user._id);
      const messages = await fetchInboxMessages(user._id);
      setInboxMessages(messages);
      console.log("Fetched inbox messages:", messages);
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

  // Handle selecting a user to start a conversation (New tab)
  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  // Render
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
              // Pass fetched inbox messages to the Messages component
              <Messages messages={inboxMessages} conversation={null} />
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
                  onClick={async () => {
                    try {
                      await handleSendMessage(selectedUser._id, newMessage);
                      setNewMessage("");
                      toast.success(
                        `Message sent to ${selectedUser.username}!`
                      );
                    } catch (error) {
                      toast.error("Failed to send the message.");
                      console.error("Error sending message:", error);
                    }
                  }}
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
