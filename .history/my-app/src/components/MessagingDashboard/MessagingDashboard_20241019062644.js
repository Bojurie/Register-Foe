import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Conversations from "./Conversations";
import { useAuth } from "../AuthContext/AuthContext";
import "./MessagingDashboard.css";
import { toast } from "react-toastify";

const MessagingDashboard = () => {
  const {
    user,
    fetchAdminUsers,
    fetchUserByCompanyCode,
    handleSendMessage,
    fetchInboxMessages,
    getSentMessages,
  } = useAuth();

  // State management
  const [activeTab, setActiveTab] = useState("New");
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null); // Conversation to reply to
  const [inboxMessages, setInboxMessages] = useState([]);
  const [outboxMessages, setOutboxMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingOutbox, setLoadingOutbox] = useState(false);
  const [isDashboardVisible, setIsDashboardVisible] = useState(true); // Manage visibility of the dashboard
  const [showMessageInput, setShowMessageInput] = useState(false); // Control message input display

  // Fetch available users based on user role
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

  // Fetch inbox messages
  const fetchInbox = useCallback(async () => {
    try {
      const messages = await fetchInboxMessages();
      setInboxMessages(messages || []);
    } catch (error) {
      console.error("Error fetching inbox messages:", error);
      toast.error("Failed to fetch inbox messages.");
    }
  }, [fetchInboxMessages]);

  // Fetch outbox messages
  const fetchOutbox = useCallback(async () => {
    setLoadingOutbox(true);
    try {
      const messages = await getSentMessages(user?._id);
      setOutboxMessages(messages || []);
    } catch (error) {
      console.error("Error fetching sent messages:", error);
      toast.error("Failed to fetch sent messages.");
    } finally {
      setLoadingOutbox(false);
    }
  }, [user, getSentMessages]);

  // Fetch initial data when component mounts
  useEffect(() => {
    if (user) {
      fetchAvailableUsers();
      fetchInbox();
      fetchOutbox();
    }
  }, [user, fetchAvailableUsers, fetchInbox, fetchOutbox]);

  // Handle sending a message
  const handleMessageSend = async () => {
    if (!selectedConversation || !newMessage.trim()) {
      toast.error("A conversation and message content are required.");
      return;
    }

    try {
      await handleSendMessage(
        selectedConversation._id, // Pass conversation ID
        selectedConversation._id, // This should be the sender or conversation ID
        newMessage
      );
      setNewMessage(""); // Clear input field
      fetchOutbox(); // Update outbox after sending
      toast.success("Message sent successfully!");
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  // When clicking a message, capture conversation ID and open reply section
  const handleMessageClick = (message) => {
    if (!message.sender) {
      toast.error("Cannot reply to an unknown sender.");
      return;
    }

    setSelectedConversation({
      _id: message.conversation,
      sender: message.sender,
    });
    setShowMessageInput(true); // Display message input section
  };

  // Render sender's name or company
  const renderSender = (message) => {
    const sender = message?.sender;
    if (!sender) return "Unknown Sender";
    return sender.companyName
      ? `${sender.companyName}`
      : `${sender.firstName || "Unknown"} ${sender.lastName || "Sender"}`;
  };

  return (
    <motion.div
      className="MessagingDashboard-Container"
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="MessagingDashboard-Header">
        <h2 onClick={() => setIsDashboardVisible((prev) => !prev)}>
          {isDashboardVisible ? "Hide" : "Show"} Messaging Dashboard
        </h2>
      </div>

      <AnimatePresence>
        {isDashboardVisible && (
          <motion.div
            className="MessagingDashboard-Content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
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

            {/* Inbox Messages */}
            {activeTab === "Inbox" && (
              <motion.div className="InboxContainer MessagesScrollable">
                <h3>Inbox Messages</h3>
                {inboxMessages.length > 0 ? (
                  inboxMessages.map((message) => (
                    <motion.div
                      key={message._id}
                      className="MessageItem"
                      onClick={() => handleMessageClick(message)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        cursor: "pointer",
                        padding: "10px",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "8px",
                        marginBottom: "10px",
                      }}
                    >
                      <p>
                        <strong>From: {renderSender(message)}</strong>
                      </p>
                      <p>{message.content || "No content"}</p>
                      <p>
                        <small>
                          {new Date(message.createdAt).toLocaleString()}
                        </small>
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <p>No inbox messages found.</p>
                )}

                {/* Show message input when a message is clicked */}
                {showMessageInput && selectedConversation && (
                  <div className="MessageInput">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={`Reply to ${
                        selectedConversation?.firstName || "Unknown"
                      }`}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        marginTop: "10px",
                        border: "1px solid #ccc",
                      }}
                    />
                    <button
                      onClick={handleMessageSend}
                      disabled={!newMessage.trim()}
                      style={{
                        marginTop: "10px",
                        padding: "10px",
                        backgroundColor: "#007bff",
                        color: "white",
                        borderRadius: "5px",
                        cursor: "pointer",
                        border: "none",
                      }}
                    >
                      Reply
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Outbox Messages */}
            {activeTab === "Outbox" && (
              <motion.div className="OutboxContainer MessagesScrollable">
                <h3>Outbox Messages</h3>
                {loadingOutbox ? (
                  <p>Loading outbox messages...</p>
                ) : outboxMessages.length > 0 ? (
                  outboxMessages.map((message) => (
                    <motion.div
                      key={message._id}
                      className="MessageItem"
                      onClick={() => handleMessageClick(message)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        cursor: "pointer",
                        padding: "10px",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "8px",
                        marginBottom: "10px",
                      }}
                    >
                      <p>
                        <strong>
                          To: {message.recipient?.firstName || "Unknown"}{" "}
                          {message.recipient?.lastName || "Recipient"}
                        </strong>
                      </p>
                      <p>{message.content || "No content"}</p>
                      <p>
                        <small>
                          {new Date(message.createdAt).toLocaleString()}
                        </small>
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <p>No sent messages found.</p>
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
