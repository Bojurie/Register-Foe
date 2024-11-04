import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../AuthContext/AuthContext";
import { toast } from "react-toastify";
import Conversations from "./Conversations";
import "./MessagingDashboard.css";

const MessagingDashboard = () => {
  const {
    user,
    fetchAdminUsers,
    fetchUserByCompanyCode,
    handleSendMessage,
    fetchInboxMessages,
  } = useAuth();

  const [activeTab, setActiveTab] = useState("New");
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isDashboardVisible, setIsDashboardVisible] = useState(true);
  const [showMessageInput, setShowMessageInput] = useState(false);
  const [inboxMessages, setInboxMessages] = useState([]);
  const [error, setError] = useState(null);

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

  const fetchInboxMessagesHandler = useCallback(async () => {
    if (!user?._id) {
      setError("User not found.");
      setLoadingMessages(false);
      return;
    }

    try {
      setLoadingMessages(true);
      const messages = await fetchInboxMessages(user._id);
      setInboxMessages(messages);
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

  const handleNewMessageSend = async () => {
    if (!selectedUser || !newMessage.trim()) {
      toast.error("A user and message content are required.");
      return;
    }

    try {
      await handleSendMessage(selectedUser._id, newMessage);
      setNewMessage("");
      toast.success(`Message sent to ${selectedUser.username}!`);
    } catch (error) {
      toast.error("Failed to send the message.");
      console.error("Error sending message:", error);
    }
  };

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
