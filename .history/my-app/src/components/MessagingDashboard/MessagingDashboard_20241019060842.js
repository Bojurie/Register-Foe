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

  const [activeTab, setActiveTab] = useState("New");
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [inboxMessages, setInboxMessages] = useState([]);
  const [outboxMessages, setOutboxMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingOutbox, setLoadingOutbox] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageInput, setShowMessageInput] = useState(false);

  // Fetch available users
  const fetchAvailableUsers = useCallback(async () => {
    try {
      const users =
        user?.role === "Admin" || user?.isCompany
          ? await fetchUserByCompanyCode(user.companyCode)
          : await fetchAdminUsers(user.companyCode);

      setAvailableUsers(users || []);
    } catch (error) {
      console.error("Error fetching available users:", error);
    }
  }, [user, fetchAdminUsers, fetchUserByCompanyCode]);

  // Fetch inbox messages
  const fetchInbox = useCallback(async () => {
    try {
      const messages = await fetchInboxMessages();
      setInboxMessages(messages || []);
    } catch (error) {
      console.error("Error fetching inbox messages:", error);
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
    } finally {
      setLoadingOutbox(false);
    }
  }, [user, getSentMessages]);

  useEffect(() => {
    if (user) {
      fetchAvailableUsers();
      fetchInbox();
      fetchOutbox();
    }
  }, [user, fetchAvailableUsers, fetchInbox, fetchOutbox]);

  // Handle sending messages
  const handleMessageSend = async () => {
    if (!selectedConversation || !newMessage.trim()) {
      toast.error("A conversation and message content are required.");
      return;
    }

    try {
      await handleSendMessage(
        selectedConversation._id,
        selectedConversation._id,
        newMessage
      );
      setNewMessage(""); // Reset the input after sending
      fetchOutbox();
      toast.success("Message sent successfully!");
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  // Handle message item click to display reply input
  const handleMessageClick = (message) => {
    if (message.sender) {
      setSelectedConversation(message.sender); // Set the selected sender as the conversation
      setSelectedMessage(message);
      setShowMessageInput(true); // Show the input box
    } else {
      toast.error("Cannot reply to an unknown sender.");
    }
  };

  // Render sender information
  const renderSender = (message) => {
    const sender = message?.sender;
    if (!sender) return "Unknown Sender";
    return sender.companyName
      ? `${sender.companyName}`
      : `${sender.firstName || "Unknown"} ${sender.lastName || "Sender"}`;
  };

  // Render recipient information
  const renderRecipients = (recipients) => {
    const recipientList = Array.isArray(recipients) ? recipients : [recipients];
    return recipientList.length === 0
      ? "Unknown Recipient"
      : recipientList
          .map((recipient) => {
            if (!recipient || !recipient.firstName || !recipient.lastName) {
              return "Unknown Recipient";
            }
            return `${recipient.firstName} ${recipient.lastName}`;
          })
          .join(", ");
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
          Messaging Dashboard
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
                      onClick={() => handleMessageClick(message)} // Trigger reply input display
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

                {/* Reply Input Section */}
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
                          To: {renderRecipients(message.recipient)}
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

            {/* New Message */}
            {activeTab === "New" && (
              <motion.div className="NewMessageContainer">
                <h3>Available Users</h3>
                <Conversations
                  availableUsers={availableUsers}
                  onConversationSelect={setSelectedConversation}
                />
                {selectedConversation && (
                  <div className="NewMessageForm">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={`Message ${selectedConversation?.username}`}
                    />
                    <button
                      onClick={handleMessageSend}
                      disabled={!newMessage.trim()}
                    >
                      Send
                    </button>
                  </div>
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
