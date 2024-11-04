import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../AuthContext/AuthContext";
import axiosInstance from "../axiosInstance"; // Assuming axiosInstance is set up for API calls
import "./MessagingDashboard.css";
import { toast } from "react-toastify";

const MessagingDashboard = () => {
  const { user, fetchAdminUsers, fetchUserByCompanyCode, handleSendMessage } =
    useAuth();

  const [activeTab, setActiveTab] = useState("New");
  const [availableUsers, setAvailableUsers] = useState([]); // For rendering users in "New" tab
  const [selectedUser, setSelectedUser] = useState(null); // Selected user for new conversation
  const [messages, setMessages] = useState([]); // Messages for selected conversation
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false); // Loading state for messages
  const [isDashboardVisible, setIsDashboardVisible] = useState(true); // Toggle visibility
  const [showMessageInput, setShowMessageInput] = useState(false); // Control message input display

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

  // Fetch messages by conversationId (not needed for new tab but kept for inbox use)
  const fetchMessagesByConversationId = useCallback(async (conversationId) => {
    if (!conversationId) return;

    setLoadingMessages(true);

    try {
      const response = await axiosInstance.get(
        `/message/messages/${conversationId}`
      );

      if (response.status !== 200) {
        toast.error("Failed to fetch messages.");
        return;
      }

      const fetchedMessages = response.data;
      setMessages(fetchedMessages || []);
    } catch (error) {
      console.error("Error fetching messages by conversation:", error);
      toast.error("Error fetching messages.");
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  // Fetch users on component mount
  useEffect(() => {
    if (user) {
      fetchAvailableUsers();
    }
  }, [user, fetchAvailableUsers]);

  // Handle sending a message to the selected user in the "New" tab
  const handleNewMessageSend = async () => {
    if (!selectedUser || !newMessage.trim()) {
      toast.error("A user and message content are required.");
      return;
    }

    try {
      await handleSendMessage(selectedUser._id, newMessage);
      setNewMessage(""); // Clear input
      toast.success(`Message sent to ${selectedUser.username}!`);
    } catch (error) {
      toast.error("Failed to send the message.");
    }
  };

  // Handle selecting a user to start a conversation
  const handleUserSelect = (user) => {
    setSelectedUser(user); // Set the selected user
    setShowMessageInput(true); // Show the message input field
  };

  // Render sender's name or company (used for Inbox/Outbox tab)
  const renderSender = (message) => {
    const sender = message?.sender;
    if (!sender) return "Unknown Sender";
    return sender.firstName
      ? `${sender.firstName} ${sender.lastName}`
      : sender.username || "Unknown Sender";
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

            {/* Inbox and Outbox Messages Logic (Remains the same as before) */}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MessagingDashboard;
