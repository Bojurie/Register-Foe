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
    handleSendMessage,
    fetchInboxMessages,
    handleReplyMessage,
  } = useAuth();

  const [activeTab, setActiveTab] = useState("Inbox");
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Track the selected user for new messages
  const [selectedMessage, setSelectedMessage] = useState(null); // Track selected message for modal
  const [newMessage, setNewMessage] = useState(""); // Message input
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

  // Handle clicking a message to open the modal (for reply)
  const handleMessageClick = (message) => {
    setSelectedMessage(message); // Set the selected message
    setIsModalOpen(true); // Open the modal
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null); // Clear selected message
    setNewMessage(""); // Clear message input
  };

  // Handle sending a new message to selected user
  const handleSendMessageToUser = async () => {
    if (!selectedUser || !newMessage.trim()) {
      toast.error("Please select a user and type a message.");
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

  // Handle replying to a message from the inbox
  const handleReplySend = async () => {
    if (!selectedMessage || !newMessage.trim()) {
      toast.error("Please type a reply.");
      return;
    }

    const { conversation, recipient } = selectedMessage;
    try {
      await handleReplyMessage(conversation, recipient, newMessage);
      setNewMessage("");
      toast.success("Reply sent successfully!");
      handleCloseModal(); // Close the modal after sending
    } catch (error) {
      toast.error("Failed to send the reply.");
      console.error("Error sending reply:", error);
    }
  };

  // Handle selecting a user from the "New" tab to send a message
  const handleUserSelect = (user) => {
    setSelectedUser(user); // Set the selected user
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
                  onClick={handleSendMessageToUser}
                  disabled={!newMessage.trim()}
                >
                  Send
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Modal for Reply */}
      {isModalOpen && selectedMessage && (
        <MessageModal
          message={selectedMessage}
          handleCloseModal={handleCloseModal}
          handleReplySend={handleReplySend}
          replyContent={newMessage}
          setReplyContent={setNewMessage} // Bind reply content to state
        />
      )}
    </motion.div>
  );
};

export default MessagingDashboard;
