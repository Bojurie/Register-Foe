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
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [inboxMessages, setInboxMessages] = useState([]);
  const [outboxMessages, setOutboxMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingOutbox, setLoadingOutbox] = useState(false);
  const [isDashboardVisible, setIsDashboardVisible] = useState(true);
  const [showMessageInput, setShowMessageInput] = useState(false);

  // Fetch users based on the user's role (Admin or Company)
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
      console.error("Error fetching outbox messages:", error);
      toast.error("Failed to fetch outbox messages.");
    } finally {
      setLoadingOutbox(false);
    }
  }, [user, getSentMessages]);

  // Initial fetch of data
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
        selectedConversation._id,
        selectedConversation._id,
        newMessage
      );
      setNewMessage(""); // Clear the message input
      fetchOutbox(); // Refresh the outbox
      toast.success("Message sent successfully!");
    } catch (error) {
      toast.error("Failed to send the message.");
    }
  };

  // Handle message click to start a reply
  const handleMessageClick = (message) => {
    if (!message.sender) {
      toast.error("Cannot reply to an unknown sender.");
      return;
    }
    setSelectedConversation({
      _id: message.conversation,
      sender: message.sender,
    });
    setShowMessageInput(true);
  };

  // Render sender's name or company
  const renderSender = (message) => {
    const sender = message?.sender;
    if (!sender) return "Unknown Sender";
    return sender.companyName
      ? `${sender.companyName}`
      : `${sender.firstName || "Unknown"} ${sender.lastName || "Sender"}`;
  };

  // Render inbox messages
  const renderInboxMessages = () => (
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
          >
            <p>
              <strong>From: {renderSender(message)}</strong>
            </p>
            <p>{message.content || "No content"}</p>
            <p>
              <small>{new Date(message.createdAt).toLocaleString()}</small>
            </p>
          </motion.div>
        ))
      ) : (
        <p>No inbox messages found.</p>
      )}
    </motion.div>
  );

  // Render outbox messages
  const renderOutboxMessages = () => (
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
          >
            <p>
              <strong>
                To: {message.recipient?.firstName || "Unknown"}{" "}
                {message.recipient?.lastName || "Recipient"}
              </strong>
            </p>
            <p>{message.content || "No content"}</p>
            <p>
              <small>{new Date(message.createdAt).toLocaleString()}</small>
            </p>
          </motion.div>
        ))
      ) : (
        <p>No sent messages found.</p>
      )}
    </motion.div>
  );

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

            {activeTab === "Inbox" && renderInboxMessages()}
            {activeTab === "Outbox" && renderOutboxMessages()}

            {/* Message input for replies */}
            {showMessageInput && selectedConversation && (
              <div className="MessageInput">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Reply to ${
                    selectedConversation?.sender?.firstName || "Unknown"
                  }`}
                />
                <button
                  onClick={handleMessageSend}
                  disabled={!newMessage.trim()}
                >
                  Reply
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
